import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, Share2, Sparkles, Disc, FileCode, ExternalLink, MessageCircle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../services/audioService';
import { getFontFamily, getFontClass } from '../data/defaultTapes';
import { generateDirectShareUrl, shortenShareUrl } from '../services/shareService';

export default function ShareModal({ isOpen, onClose, tape, onAddToRack }) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  useEffect(() => {
    if (!isOpen || !tape) return;

    let isMounted = true;
    setIsLoadingUrl(true);

    (async () => {
      try {
        // 1. Immediately create compact share link
        const directUrl = await generateDirectShareUrl(tape);
        if (isMounted) {
          setShareUrl(directUrl);
        }

        // 2. If it's a long link, asynchronously shorten it for a sleek single-line URL
        const shortened = await shortenShareUrl(directUrl);
        if (isMounted && shortened) {
          setShareUrl(shortened);
        }
      } catch (err) {
        console.error('Failed to generate share URL', err);
        if (isMounted) {
          setShareUrl(window.location.href);
        }
      } finally {
        if (isMounted) {
          setIsLoadingUrl(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isOpen, tape]);

  if (!isOpen || !tape) return null;

  const handleCopyLink = () => {
    audioEngine.playButtonTick();
    const urlToCopy = shareUrl || window.location.href;
    navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    audioEngine.playButtonTick();
    const urlToShare = shareUrl || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tape.title} — 90s Mixtape`,
          text: `📼 Listen to "${tape.title}" curated by ${tape.author} on Mixtape Creator:`,
          url: urlToShare,
        });
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareWhatsApp = () => {
    audioEngine.playButtonTick();
    const urlToShare = shareUrl || window.location.href;
    const text = encodeURIComponent(`📼 Listen to my mixtape "${tape.title}" by ${tape.author} on Mixtape Creator:\n${urlToShare}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    audioEngine.playButtonTick();
    const urlToShare = shareUrl || window.location.href;
    const text = encodeURIComponent(`📼 Listen to my mixtape "${tape.title}" by ${tape.author} on Mixtape Creator! 🎶`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(urlToShare)}`, '_blank');
  };

  // Export full high-resolution unfolded J-Card image
  const handleExportPNG = async () => {
    audioEngine.playButtonTick();
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1400;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');

      // 1. Vintage Tabletop Dark Background
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 0, 1400, 900);

      // 2. Unfolded J-Card Paper
      ctx.fillStyle = tape.colors?.paper || '#f7f4ea';
      ctx.roundRect(80, 60, 1240, 780, 24);
      ctx.fill();
      ctx.strokeStyle = '#d9770630';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Fold lines
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(80, 220);
      ctx.lineTo(1320, 220);
      ctx.moveTo(80, 360);
      ctx.lineTo(1320, 360);
      ctx.stroke();
      ctx.setLineDash([]);

      // Panel 1: Top Brand Banner
      ctx.fillStyle = tape.colors?.primary || '#d97706';
      ctx.fillRect(110, 90, 1180, 90);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Space Mono", sans-serif';
      ctx.fillText('AUDIO CASSETTE • NORMAL BIAS 120µs EQ', 140, 148);
      ctx.font = 'extrabold 44px "Space Mono", sans-serif';
      ctx.fillText(`${tape.format || 'CRX'} 40`, 1140, 152);

      // Panel 2: Spine
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.roundRect(110, 240, 1180, 90, 12);
      ctx.fill();

      // Spine Badge
      ctx.fillStyle = tape.colors?.secondary || '#9a3412';
      ctx.roundRect(130, 255, 90, 60, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Space Mono", sans-serif';
      ctx.fillText('40', 160, 292);

      // Spine Title & Author
      ctx.fillStyle = tape.colors?.ink || '#0c0a09';
      ctx.font = 'bold 44px "Covered By Your Grace", sans-serif';
      ctx.fillText(tape.title, 250, 298);

      ctx.font = 'bold 28px "Caveat", sans-serif';
      ctx.fillStyle = '#52525b';
      ctx.fillText(`by ${tape.author}`, 1080, 298);

      // Panel 3: Tracklists (Side A & Side B)
      const sideATracks = tape.sideA?.tracks || [];
      const sideBTracks = tape.sideB?.tracks || [];

      // Side A Header
      ctx.fillStyle = tape.colors?.primary || '#d97706';
      ctx.fillRect(110, 390, 560, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Space Mono", sans-serif';
      ctx.fillText(`SIDE A — ${tape.sideA?.title || 'Side A'}`, 130, 422);

      // Side A Tracks
      sideATracks.forEach((track, i) => {
        if (i > 7) return;
        const y = 470 + i * 36;
        ctx.fillStyle = tape.colors?.highlighter || '#ec4899';
        ctx.beginPath();
        ctx.arc(135, y - 8, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Space Mono", sans-serif';
        ctx.fillText(`${i + 1}`, 130, y - 2);

        ctx.fillStyle = tape.colors?.ink || '#0c0a09';
        ctx.font = '26px "Covered By Your Grace", sans-serif';
        const trackText = `${track.title} – ${track.artist}`;
        ctx.fillText(trackText.length > 32 ? trackText.substring(0, 32) + '...' : trackText, 160, y - 2);

        ctx.font = '18px "Space Mono", sans-serif';
        ctx.fillStyle = '#71717a';
        ctx.fillText(track.duration || '3:30', 600, y - 2);
      });

      // Side B Header
      ctx.fillStyle = tape.colors?.secondary || '#9a3412';
      ctx.fillRect(730, 390, 560, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Space Mono", sans-serif';
      ctx.fillText(`SIDE B — ${tape.sideB?.title || 'Side B'}`, 750, 422);

      // Side B Tracks
      sideBTracks.forEach((track, i) => {
        if (i > 7) return;
        const y = 470 + i * 36;
        ctx.fillStyle = tape.colors?.highlighter || '#ec4899';
        ctx.beginPath();
        ctx.arc(755, y - 8, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Space Mono", sans-serif';
        ctx.fillText(`${i + 1}`, 750, y - 2);

        ctx.fillStyle = tape.colors?.ink || '#0c0a09';
        ctx.font = '26px "Covered By Your Grace", sans-serif';
        const trackText = `${track.title} – ${track.artist}`;
        ctx.fillText(trackText.length > 32 ? trackText.substring(0, 32) + '...' : trackText, 780, y - 2);

        ctx.font = '18px "Space Mono", sans-serif';
        ctx.fillStyle = '#71717a';
        ctx.fillText(track.duration || '3:30', 1220, y - 2);
      });

      // Liner Note / Dedication at bottom
      if (tape.linerNotes) {
        ctx.fillStyle = '#71717a';
        ctx.font = 'italic 28px "Caveat", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`"${tape.linerNotes}"`, 700, 790);
        ctx.textAlign = 'left';
      }

      // Trigger Download
      const link = document.createElement('a');
      link.download = `${tape.title.replace(/\s+/g, '_')}_JCard.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('PNG export failed', e);
    } finally {
      setIsExporting(false);
    }
  };

  // Export JSON Mixtape Backup
  const handleExportJSON = () => {
    audioEngine.playButtonTick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tape, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${tape.title.replace(/\s+/g, '_')}.mixtape.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#1c1917] border-2 border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl paper-texture text-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#ecdcb7] border-b border-amber-900/20">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-800" />
            <h3 className="font-['Permanent_Marker'] text-xl text-neutral-900 tracking-wide">
              SHARE YOUR MIXTAPE
            </h3>
          </div>
          <button
            onClick={() => {
              audioEngine.playButtonTick();
              onClose();
            }}
            className="p-1 rounded bg-black/10 hover:bg-black/20 text-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Mini Tape Preview */}
          <div className="p-4 bg-white/85 rounded-xl border border-black/10 flex items-center justify-between shadow-inner">
            <div className="min-w-0 pr-2">
              <div className="text-xs font-['Space_Mono'] text-neutral-600 uppercase font-bold">
                {tape.format || 'CRX 40'} Mixtape
              </div>
              <h4 
                className={`text-2xl font-bold text-neutral-900 truncate ${getFontClass(tape?.font)}`}
                style={{ fontFamily: getFontFamily(tape?.font) }}
              >
                {tape.title}
              </h4>
              <div className="text-xs font-['Caveat'] text-neutral-600 font-bold">
                by {tape.author} • {(tape.sideA?.tracks?.length || 0) + (tape.sideB?.tracks?.length || 0)} tracks
              </div>
            </div>

            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-['Permanent_Marker'] text-xl shadow shrink-0"
              style={{ backgroundColor: tape.colors?.primary || '#d97706' }}
            >
              📼
            </div>
          </div>

          {/* Sleek Single-Line Shareable Link */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-['Space_Mono'] uppercase tracking-wider text-neutral-700 font-bold flex items-center gap-1.5">
                <span>Shareable Short Link</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 border border-amber-900/20">
                  Sleek 1-Line
                </span>
              </label>
              {isLoadingUrl && (
                <span className="text-[10px] font-['Space_Mono'] text-neutral-500 animate-pulse">
                  Optimizing link...
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={shareUrl || 'Generating short link...'}
                  className="w-full px-3 py-2.5 bg-white border border-black/20 rounded-lg text-xs font-['Space_Mono'] text-neutral-800 truncate select-all focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
              </div>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#8f1d14] hover:bg-[#a8201a] text-white font-['Permanent_Marker'] text-xs rounded-lg shadow active:scale-95 transition-all shrink-0 cursor-pointer"
                title="Copy short link to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'COPIED!' : 'COPY'}</span>
              </button>
            </div>
          </div>

          {/* Social Quick Share Buttons */}
          <div className="flex items-center gap-2 pt-0.5">
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={handleNativeShare}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 border border-amber-900/20 rounded-lg text-xs font-['Space_Mono'] font-bold transition-all hover:scale-[1.02] active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-amber-900" />
                <span>Quick Share</span>
              </button>
            )}

            <button
              onClick={handleShareWhatsApp}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-950 border border-emerald-900/20 rounded-lg text-xs font-['Space_Mono'] font-bold transition-all hover:scale-[1.02] active:scale-95"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-800" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-sky-500/15 hover:bg-sky-500/25 text-sky-950 border border-sky-900/20 rounded-lg text-xs font-['Space_Mono'] font-bold transition-all hover:scale-[1.02] active:scale-95"
              title="Share on X / Twitter"
            >
              <span className="font-bold text-xs text-sky-900">𝕏</span>
              <span>Twitter</span>
            </button>
          </div>

          {/* Action Buttons: Export Image, Export JSON & Put on Rack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-black text-white font-['Space_Mono'] text-xs font-bold rounded-lg shadow transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{isExporting ? 'PRINTING J-CARD...' : 'PRINT J-CARD PNG'}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-200 font-['Space_Mono'] text-xs font-bold rounded-lg shadow transition-all border border-amber-500/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>SAVE JSON BACKUP</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playButtonTick();
                if (onAddToRack) onAddToRack(tape);
                confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
                onClose();
              }}
              className="sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-black font-['Permanent_Marker'] text-sm rounded-lg shadow hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Disc className="w-4 h-4" />
              <span>PUT ON THE RACK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
