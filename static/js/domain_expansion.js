/**
 * Domain Expansion Detection and VFX System
 * Ported from Python/OpenCV implementation
 */

class DomainExpansionGame {
    constructor() {
        this.predictionHistory = [];
        this.historyMaxLen = 10;
        
        this.activeDomain = null;
        this.stableDomain = null;
        
        // VFX State
        this.stars = [];
        this.symbols = [];
        this.slashes = [];
        this.flashCounter = 0;
        this.mahitoPhase = 0;
        this.ghostFrames = [];
        this.yutaPhase = 0;
        this.hakariPhase = 0;
        this.slotNumbers = ['0', '0', '0'];
        this.confetti = [];
        this.yujiPhase = 0;
        this.shockwaveRad = 0;
        
        this.vfxCanvas = null;
        this.stableDomain = null;

        this.displayNames = {
            "Unlimited Void": "無量空處",
            "Malevolent Shrine": "伏魔御廚子",
            "Self-Embodiment of Perfection": "自閉圓頓裹",
            "Authentic Mutual Love": "真贋相愛",
            "Idle Death Gamble": "坐殺博徒",
            "Yuji Itadori": "虎杖悠仁 (名稱不明)"
        };

        // Colors mapping
        this.domainColors = {
            "Authentic Mutual Love": "rgb(180, 100, 255)",
            "Idle Death Gamble": "rgb(0, 200, 255)",
            "Malevolent Shrine": "rgb(255, 0, 0)",
            "Yuji Itadori": "rgb(0, 255, 0)",
            "Self-Embodiment of Perfection": "rgb(255, 0, 255)",
            "Unlimited Void": "rgb(255, 255, 255)"
        };
    }

    initVFX(canvas) {
        this.vfxCanvas = canvas;
        this.vfxCtx = canvas.getContext('2d');
        this.initStars(canvas.width, canvas.height);
    }

    // --- Geometry Helpers ---

    distance3d(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
    }

    angle3d(a, b, c) {
        const bax = a.x - b.x, bay = a.y - b.y, baz = a.z - b.z;
        const bcx = c.x - b.x, bcy = c.y - b.y, bcz = c.z - b.z;

        const dot = bax * bcx + bay * bcy + baz * bcz;
        const normBa = Math.sqrt(bax * bax + bay * bay + baz * baz);
        const normBc = Math.sqrt(bcx * bcx + bcy * bcy + bcz * bcz);
        
        if (normBa === 0 || normBc === 0) return 0.0;

        const cosine = Math.max(-1.0, Math.min(1.0, dot / (normBa * normBc)));
        return (Math.acos(cosine) * 180) / Math.PI;
    }

    isFingerExtended(landmarks, mcp, pip, tip, thresholdDeg = 155.0) {
        return this.angle3d(landmarks[mcp], landmarks[pip], landmarks[tip]) >= thresholdDeg;
    }

    isFingerCurled(landmarks, mcp, pip, tip, thresholdDeg = 130.0) {
        return this.angle3d(landmarks[mcp], landmarks[pip], landmarks[tip]) <= thresholdDeg;
    }

    palmScale(landmarks) {
        return Math.max(this.distance3d(landmarks[0], landmarks[9]), 1e-6);
    }

    handCenter(landmarks) {
        const scale = this.palmScale(landmarks);
        const centerX = (landmarks[0].x + landmarks[5].x + landmarks[9].x + landmarks[13].x + landmarks[17].x) / 5;
        const centerY = (landmarks[0].y + landmarks[5].y + landmarks[9].y + landmarks[13].y + landmarks[17].y) / 5;
        return { x: centerX, y: centerY, scale: scale };
    }

    normalizedPointDistance(pointA, pointB, scale) {
        return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)) / scale;
    }

    isFist(hand) {
        return [
            this.isFingerCurled(hand, 5, 6, 8, 135),
            this.isFingerCurled(hand, 9, 10, 12, 135),
            this.isFingerCurled(hand, 13, 14, 16, 135),
            this.isFingerCurled(hand, 17, 18, 20, 135)
        ].every(Boolean);
    }

    isOpenHandThumbIn(hand) {
        const fingersExtended = [
            this.isFingerExtended(hand, 5, 6, 8),
            this.isFingerExtended(hand, 9, 10, 12),
            this.isFingerExtended(hand, 13, 14, 16),
            this.isFingerExtended(hand, 17, 18, 20)
        ].filter(Boolean).length;

        if (fingersExtended < 3) return false;

        const scale = this.palmScale(hand);
        const thumbToPalm = this.distance3d(hand[4], hand[9]) / scale;
        return thumbToPalm < 0.55;
    }

    // --- Pair Checks ---

    isYutaPair(handA, handB) {
        const scale = (this.palmScale(handA) + this.palmScale(handB)) / 2;
        const aIsFist = this.isFist(handA);
        const bIsFist = this.isFist(handB);
        const aIsOpen = this.isOpenHandThumbIn(handA);
        const bIsOpen = this.isOpenHandThumbIn(handB);

        if (!((aIsFist && bIsOpen) || (bIsFist && aIsOpen))) return false;

        const wristDist = this.distance3d(handA[0], handB[0]) / scale;
        return wristDist <= 1.8;
    }

    isHakariPair(handA, handB) {
        let upper, lower;
        if (handA[0].y < handB[0].y) {
            upper = handA; lower = handB;
        } else {
            upper = handB; lower = handA;
        }

        const scale = (this.palmScale(upper) + this.palmScale(lower)) / 2;
        const tipDist = this.distance3d(upper[4], upper[8]) / scale;
        const isCircle = tipDist < 0.35;
        const middleStraight = this.isFingerExtended(upper, 9, 10, 12);
        const ringStraight = this.isFingerExtended(upper, 13, 14, 16);
        const pinkyStraight = this.isFingerExtended(upper, 17, 18, 20);
        
        const upperOk = isCircle && middleStraight && ringStraight && pinkyStraight;

        const lowerFingersStraight = [
            this.isFingerExtended(lower, 5, 6, 8),
            this.isFingerExtended(lower, 9, 10, 12),
            this.isFingerExtended(lower, 13, 14, 16),
            this.isFingerExtended(lower, 17, 18, 20)
        ].every(Boolean);

        const verticalGap = lower[9].y - upper[0].y;
        const handsClose = verticalGap > 0.1 && verticalGap < 1.0;

        return isCircle && middleStraight && ringStraight && pinkyStraight && lowerFingersStraight && handsClose;
    }

    isYujiPair(handA, handB) {
        const scale = (this.palmScale(handA) + this.palmScale(handB)) / 2;
        const indexA = this.isFingerExtended(handA, 5, 6, 8);
        const indexB = this.isFingerExtended(handB, 5, 6, 8);

        if (!(indexA && indexB)) return false;

        const isVertical = (hand) => {
            const tip = hand[8];
            const mcp = hand[5];
            const dx = Math.abs(tip.x - mcp.x);
            const dy = Math.abs(tip.y - mcp.y);
            return dy > dx * 1.8;
        };

        if (!(isVertical(handA) && isVertical(handB))) return false;

        const indexDist = this.distance3d(handA[8], handB[8]) / scale;
        if (indexDist > 0.4) return false;

        const wristDist = this.distance3d(handA[0], handB[0]) / scale;
        if (wristDist < 0.3 || wristDist > 1.5) return false;

        const vecA = handA[8].y - handA[5].y;
        const vecB = handB[8].y - handB[5].y;

        return vecA * vecB >= 0;
    }

    isMahitoPair(handA, handB) {
        const scale = (this.palmScale(handA) + this.palmScale(handB)) / 2;
        const pinkyDist = this.distance3d(handA[20], handB[20]) / scale;
        if (pinkyDist > 0.9) return false;

        const thumbDist = this.distance3d(handA[4], handB[4]) / scale;
        if (thumbDist > 1.0) return false;

        const centerA = this.handCenter(handA);
        const centerB = this.handCenter(handB);
        const palmGap = this.normalizedPointDistance(centerA, centerB, scale);

        if (palmGap < 0.6 || palmGap > 2.2) return false;

        const wristDist = this.distance3d(handA[0], handB[0]) / scale;
        return wristDist >= 0.4 && wristDist <= 3.5;
    }

    isSukunaPair(handA, handB) {
        const scale = (this.palmScale(handA) + this.palmScale(handB)) / 2;
        const mDist = this.distance3d(handA[12], handB[12]) / scale;
        const rDist = this.distance3d(handA[16], handB[16]) / scale;
        const pDist = this.distance3d(handA[20], handB[20]) / scale;

        const touches = [mDist <= 0.75, rDist <= 0.75, pDist <= 0.75].filter(Boolean).length;
        if (touches < 2) return false;

        const midRingLeft = this.distance3d(handA[12], handA[16]) / scale;
        const midRingRight = this.distance3d(handB[12], handB[16]) / scale;
        const triangleShape = (midRingLeft >= 0.25 && midRingLeft <= 1.8) && 
                            (midRingRight >= 0.25 && midRingRight <= 1.8);

        if (!triangleShape) return false;

        const wristDist = this.distance3d(handA[0], handB[0]) / scale;
        return wristDist >= 0.4 && wristDist <= 4.2;
    }

    isGojoHand(landmarks) {
        const indexExt = this.isFingerExtended(landmarks, 5, 6, 8);
        const middleExt = this.isFingerExtended(landmarks, 9, 10, 12);
        const ringCurl = this.isFingerCurled(landmarks, 13, 14, 16);
        const pinkyCurl = this.isFingerCurled(landmarks, 17, 18, 20);

        const scale = this.palmScale(landmarks);
        const tipsClose = this.distance3d(landmarks[8], landmarks[12]) / scale <= 0.65;

        return indexExt && middleExt && ringCurl && pinkyCurl && tipsClose;
    }

    // --- Main Logic ---

    detectDomain(hands) {
        if (!hands || hands.length === 0) return null;

        if (hands.length === 1) {
            if (this.isGojoHand(hands[0])) return "Unlimited Void";
        }

        if (hands.length >= 2) {
            // Check pairs
            for (let i = 0; i < hands.length - 1; i++) {
                for (let j = i + 1; j < hands.length; j++) {
                    if (this.isYutaPair(hands[i], hands[j])) return "Authentic Mutual Love";
                    if (this.isHakariPair(hands[i], hands[j])) return "Idle Death Gamble";
                    if (this.isYujiPair(hands[i], hands[j])) return "Yuji Itadori";
                    if (this.isMahitoPair(hands[i], hands[j])) return "Self-Embodiment of Perfection";
                    if (this.isSukunaPair(hands[i], hands[j])) return "Malevolent Shrine";
                }
            }
        }

        return null;
    }

    update(hands) {
        const detected = this.detectDomain(hands);
        this.predictionHistory.push(detected || "");
        if (this.predictionHistory.length > this.historyMaxLen) {
            this.predictionHistory.shift();
        }

        const counts = {};
        this.predictionHistory.forEach(p => { if(p) counts[p] = (counts[p] || 0) + 1; });
        
        let topLabel = null;
        let topCount = 0;
        for (const label in counts) {
            if (counts[label] > topCount) {
                topCount = counts[label];
                topLabel = label;
            }
        }

        if (topCount >= 8 && topCount >= (this.predictionHistory.length * 0.6)) {
            this.stableDomain = topLabel;
        } else {
            this.stableDomain = null;
        }

        return this.stableDomain;
    }

    // --- VFX ---

    initStars(w, h, count = 150) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({ x: Math.random() * w, y: Math.random() * h, speed: 0.5 + Math.random() * 2.5 });
        }
        this.symbols = [];
        for (let i = 0; i < 30; i++) {
            this.symbols.push({ x: Math.random() * w, y: Math.random() * h, speed: 2 + Math.random() * 4, text: Math.floor(Math.random() * 10).toString() });
        }
    }

    drawVFX(frameCanvas, stableDomain) {
        if (!this.vfxCtx) return;
        const ctx = this.vfxCtx;
        const w = this.vfxCanvas.width;
        const h = this.vfxCanvas.height;

        ctx.clearRect(0, 0, w, h);

        if (!stableDomain) {
            // Reset VFX states when no domain is active
            this.slashes = [];
            this.flashCounter = 0;
            this.ghostFrames = [];
            return;
        }

        switch (stableDomain) {
            case "Unlimited Void":
                this.applyUnlimitedVoid(ctx, w, h);
                break;
            case "Malevolent Shrine":
                this.applyMalevolentShrine(ctx, w, h);
                break;
            case "Self-Embodiment of Perfection":
                this.applySelfEmbodiment(ctx, w, h);
                break;
            case "Authentic Mutual Love":
                this.applyAuthenticLove(ctx, w, h);
                break;
            case "Idle Death Gamble":
                this.applyIdleDeathGamble(ctx, w, h);
                break;
            case "Yuji Itadori":
                this.applyYujiDomain(ctx, w, h);
                break;
        }
    }

    applyUnlimitedVoid(ctx, w, h) {
        // Darken
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, w, h);

        // Stars
        ctx.fillStyle = "white";
        this.stars.forEach(s => {
            s.y = (s.y + s.speed) % h;
            ctx.beginPath();
            ctx.arc(s.x, s.y, 1, 0, Math.PI * 2);
            ctx.fill();
        });

        // Symbols
        ctx.font = "15px monospace";
        this.symbols.forEach(s => {
            s.y = (s.y + s.speed) % h;
            ctx.fillText(s.text, s.x, s.y);
        });
    }

    applyMalevolentShrine(ctx, w, h) {
        // Red tint
        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.fillRect(0, 0, w, h);

        // Flash
        this.flashCounter++;
        if (this.flashCounter % 10 === 0) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillRect(0, 0, w, h);
        }

        // Slashes
        if (Math.random() < 0.6) {
            const x1 = Math.random() * w;
            const y1 = Math.random() * h;
            const length = 80 + Math.random() * 120;
            const angle = (Math.random() - 0.5) * 1.6;
            this.slashes.push({
                x1: x1, y1: y1,
                x2: x1 + length * Math.cos(angle),
                y2: y1 + length * Math.sin(angle),
                life: 3 + Math.floor(Math.random() * 4)
            });
        }

        ctx.strokeStyle = "white";
        this.slashes = this.slashes.filter(s => {
            ctx.lineWidth = s.life;
            ctx.beginPath();
            ctx.moveTo(s.x1, s.y1);
            ctx.lineTo(s.x2, s.y2);
            ctx.stroke();
            s.life--;
            return s.life > 0;
        });
    }

    applySelfEmbodiment(ctx, w, h) {
        this.mahitoPhase += 0.2;
        // Purple tint
        ctx.fillStyle = `rgba(150, 0, 150, ${0.2 + 0.05 * Math.sin(this.mahitoPhase)})`;
        ctx.fillRect(0, 0, w, h);
        
        // Distortion and ghosts are harder in pure 2D canvas without access to previous frame's pixels efficiently
        // but we can do a simple trailing effect if we don't clearRect completely, but here we do.
        // We'll skip complex pixel manipulation for now and use simple overlays.
    }

    applyAuthenticLove(ctx, w, h) {
        this.yutaPhase += 0.03;
        // Pink vignette
        const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
        grad.addColorStop(0, "rgba(180, 100, 255, 0)");
        grad.addColorStop(1, "rgba(180, 100, 255, 0.4)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Pulse
        const brightness = 0.1 * Math.sin(this.yutaPhase);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, brightness)})`;
        ctx.fillRect(0, 0, w, h);
    }

    applyIdleDeathGamble(ctx, w, h) {
        this.hakariPhase++;
        // Gold tint
        ctx.fillStyle = "rgba(255, 215, 0, 0.2)";
        ctx.fillRect(0, 0, w, h);

        // Slots
        if (this.hakariPhase % 3 === 0) {
            this.slotNumbers = [
                Math.floor(Math.random()*10).toString(),
                Math.floor(Math.random()*10).toString(),
                Math.floor(Math.random()*10).toString()
            ];
        }
        ctx.fillStyle = "white";
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`[${this.slotNumbers[0]}] [${this.slotNumbers[1]}] [${this.slotNumbers[2]}]`, w/2, h - 50);

        // Confetti
        if (this.confetti.length === 0) {
            for(let i=0; i<50; i++) {
                this.confetti.push({
                    x: Math.random()*w, y: Math.random()*h, 
                    speed: 2+Math.random()*3, 
                    color: ["#FFFF00", "#FFD700", "#FFFFFF"][Math.floor(Math.random()*3)]
                });
            }
        }
        this.confetti.forEach(p => {
            p.y = (p.y + p.speed) % h;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
            ctx.fill();
        });
    }

    applyYujiDomain(ctx, w, h) {
        this.yujiPhase += 0.1;
        // Green pulse
        ctx.fillStyle = `rgba(0, 255, 0, ${0.1 * Math.abs(Math.sin(this.yujiPhase * 4))})`;
        ctx.fillRect(0, 0, w, h);

        // Shockwave
        this.shockwaveRad = (this.shockwaveRad + 10) % Math.max(w, h);
        ctx.strokeStyle = "rgba(100, 255, 100, 0.5)";
        ctx.lineWidth = 5 * (1 - this.shockwaveRad / Math.max(w, h));
        ctx.beginPath();
        ctx.arc(w/2, h/2, this.shockwaveRad, 0, Math.PI * 2);
        ctx.stroke();
    }
}

window.DomainExpansionGame = DomainExpansionGame;
