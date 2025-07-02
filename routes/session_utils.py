#!/usr/bin/env python3
"""Session and authentication utilities for the Robot Simulator"""

import base64
import json
import logging
import os
from datetime import datetime, timedelta
from typing import Any, Dict, Optional
from zoneinfo import ZoneInfo

import requests
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from urllib.parse import unquote_plus

ROBOT_API_URL = os.getenv("ROBOT_API_URL", None)

SESSION_AES_KEY = os.environ.get("SESSION_AES_KEY", "0123456789012345").encode()
SESSION_AES_IV = os.environ.get("SESSION_AES_IV", "5432109876543210").encode()

# Set up logger
logger = logging.getLogger(__name__)


def send_request(method: str, robot_id: str, action: str) -> Optional[Dict[str, Any]]:
    """Send request to external robot API"""
    if not ROBOT_API_URL:
        logger.info("ROBOT_API_URL environment variable is not set.")
        return None

    data = {"method": method, "action": action}
    try:
        response = requests.post(
            ROBOT_API_URL + robot_id,
            json=data,
            timeout=3,
        )
        response.raise_for_status()
        logger.info(
            f"Action {method} successful for robot_id={robot_id}. Response: {response.json()}"
        )
        return response.json()
    except requests.RequestException as e:
        logger.error(f"Error sending request: {e}")
        return None


def decrypt(session_key: str) -> Optional[dict]:
    """
    Decrypts an AES encrypted string using a fixed key and IV.

    Args:
        session_key: The base64-encoded AES encrypted string.

    Returns:
        A dictionary containing the decrypted session data, or None if decryption fails.
    """

    try:
        # Convert the encrypted string to bytes
        # Use unquote_plus to handle URL-encoded characters, spaces, and plus signs
        session_key = unquote_plus(session_key).replace(" ", "+")
        encrypted_bytes = base64.b64decode(session_key)

        # Perform AES decryption
        cipher = Cipher(
            algorithms.AES(SESSION_AES_KEY),
            modes.CBC(SESSION_AES_IV),
            backend=default_backend(),
        )
        decryptor = cipher.decryptor()
        decrypted_bytes = decryptor.update(encrypted_bytes) + decryptor.finalize()

        # Remove padding (assuming PKCS7 padding)
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
        decrypted_bytes = unpadder.update(decrypted_bytes) + unpadder.finalize()

        # Decode the bytes to a string
        decrypted_string = decrypted_bytes.decode("utf-8")

        logger.info(f"Decrypted string: {decrypted_string}")

        # TODO: Quick fix for trailing double quote issue
        if decrypted_string.endswith('"'):
            decrypted_string = decrypted_string[:-1]
        # Validate and parse JSON
        try:
            session_object = json.loads(decrypted_string)
        except json.JSONDecodeError as json_error:
            logger.error(f"JSON parsing error: {json_error}")
            return None

        # Convert Excel serial dates to datetime and check validity
        excel_start_date = datetime(1899, 12, 30, tzinfo=ZoneInfo("Asia/Hong_Kong"))
        decoded_datetime_to = decoded_datetime_from = None

        if "to" in session_object:
            decoded_datetime_to = excel_start_date + timedelta(
                days=session_object["to"]
            )
            session_object["to"] = decoded_datetime_to

        if "from" in session_object:
            decoded_datetime_from = excel_start_date + timedelta(
                days=session_object["from"]
            )
            session_object["from"] = decoded_datetime_from

        current_time = datetime.now(ZoneInfo("Asia/Hong_Kong"))
        session_object["is_valid"] = (
            decoded_datetime_from is not None
            and decoded_datetime_to is not None
            and decoded_datetime_from < current_time < decoded_datetime_to
        )
        logger.info(f"Session object after decryption: {session_object}")
        return session_object

    except Exception as e:
        logger.info(f"Decryption failed: {e}")
        return None
