#!/usr/bin/env python3
"""Session and authentication utilities for the Robot Simulator"""

import base64
import json
import logging
import os
import time
from datetime import datetime, timedelta
from typing import Any, Dict, Optional
from urllib.parse import unquote_plus
from zoneinfo import ZoneInfo

import requests
import boto3
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

_ROBOT_API_URL = os.getenv("ROBOT_API_URL", None)
_LAST_SSM_FETCH_TIME = 0

def get_robot_api_url():
    """Dynamically fetch the Robot API URL from environment or SSM with caching"""
    global _ROBOT_API_URL, _LAST_SSM_FETCH_TIME
    
    # 1. Return cached or env-set URL immediately
    if _ROBOT_API_URL:
        return _ROBOT_API_URL

    # 2. Rate-limit SSM lookups to prevent freezing the server on failures (once per min)
    now = time.time()
    if now - _LAST_SSM_FETCH_TIME < 60:
        return None
    
    _LAST_SSM_FETCH_TIME = now

    try:
        # Fallback: Try to get from SSM Parameter Store
        ssm = boto3.client("ssm")
        param_name = "/robotics/robot_api_url"
        logger.info(f"🔍 ROBOT_API_URL not set. Attempting lookup from SSM: {param_name}")
        
        response = ssm.get_parameter(Name=param_name)
        _ROBOT_API_URL = response["Parameter"]["Value"]
        
        logger.info(f"✅ Discovered API URL via SSM: {_ROBOT_API_URL}")
        return _ROBOT_API_URL
    except Exception as e:
        logger.error(f"❌ Failed to fetch ROBOT_API_URL from SSM: {e}")
        return None

SESSION_AES_KEY = os.environ.get("SESSION_AES_KEY", "0123456789012345").encode()
SESSION_AES_IV = os.environ.get("SESSION_AES_IV", "5432109876543210").encode()

# Set up logger
logger = logging.getLogger(__name__)


# Mapping from Simulation/Domain actions to standard Real Robot actions
# (Using only short combat/gesture moves - no long dances)
# NOTE: Actions MUST start with "robot_" to be recognized by Text Control tools
REAL_ROBOT_ACTION_MAP = {
    "domain_unlimited_void": "robot_twist",            # Gojo: Rhythmic focus
    "domain_malevolent_shrine": "robot_kung_fu",       # Sukuna: Sharp martial arts
    "domain_self_embodiment": "robot_right_shot_fast", # Mahito: Powerful direct strike
    "domain_authentic_love": "robot_bow",             # Yuta: Respectful bow
    "domain_idle_death_gamble": "robot_wave",          # Hakari: Rhythmic waving
    "domain_yuji_itadori": "robot_sit_ups",            # Yuji: Physical training (Sit ups)
    "domain_chimera_shadow_garden": "robot_weightlifting", # Megumi: Shadow strength (Weightlifting)
    "domain_time_cell_moon_palace": "robot_left_shot_fast", # Naoya: Frame-by-frame strike (Left Shot)
    "lapse_blue": "robot_left_uppercut",              # Blue: Left hand attraction strike
    "reversal_red": "robot_right_uppercut",           # Red: Right hand strike
    "hollow_purple": "robot_chest"                     # Purple: 2-hand chest expansion blast
}

def send_request(method: str, robot_id: str, action: str) -> Optional[Dict[str, Any]]:
    """Send request to external robot API with action mapping for hardware compatibility"""
    api_url = get_robot_api_url()
    if not api_url:
        logger.warning("❌ ROBOT_API_URL is NOT set and SSM lookup failed. Cannot call real robot.")
        return None

    # Map the action to a standard hardware-supported action if necessary
    hardware_action = REAL_ROBOT_ACTION_MAP.get(action, action)
    
    target_url = f"{api_url.rstrip('/')}/{robot_id.lstrip('/')}"
    data = {"method": method, "action": hardware_action}
    
    # Internal secret for service-to-service bypass
    INTERNAL_SECRET = os.getenv("INTERNAL_ROBOT_SECRET", "hktiit_robot_internal_bypass_2026")
    headers = {
        "X-Internal-Secret": INTERNAL_SECRET,
        "Content-Type": "application/json"
    }
    
    logger.info(f"🚀 CALLING REAL ROBOT (INTERNAL): {target_url} with data: {data} (Original: {action})")
    
    try:
        response = requests.post(
            target_url,
            json=data,
            headers=headers,
            timeout=5,
        )
        logger.info(f"📥 API RESPONSE [{response.status_code}]: {response.text}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        logger.error(f"❌ Error sending request to {target_url}: {e}")
        if hasattr(e, 'response') and e.response is not None:
             logger.error(f"❌ Response details: {e.response.text}")
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
