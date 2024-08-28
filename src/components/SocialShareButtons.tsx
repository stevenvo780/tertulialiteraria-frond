import React, { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
} from 'react-share';
import { FaCopy, FaCheckCircle } from 'react-icons/fa';

interface SocialShareButtonsProps {
  shareUrl: string;
  title: string;
  summary?: string;
  size?: number;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ size = 60, shareUrl, title, summary }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="d-flex justify-content-around flex-wrap">
      <FacebookShareButton url={shareUrl} title={title} className="mb-2">
        <FacebookIcon size={size} round />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={title} className="mb-2">
        <TwitterIcon size={size} round />
      </TwitterShareButton>
      <WhatsappShareButton url={shareUrl} title={title} separator=":: " className="mb-2">
        <WhatsappIcon size={size} round />
      </WhatsappShareButton>
      <LinkedinShareButton url={shareUrl} title={title} summary={summary || ''} source={window.location.origin} className="mb-2">
        <LinkedinIcon size={size} round />
      </LinkedinShareButton>
      <TelegramShareButton url={shareUrl} title={title} className="mb-2">
        <TelegramIcon size={size} round />
      </TelegramShareButton>
      <button onClick={handleCopyUrl} className="btn btn-link mb-2">
        {copied ? <FaCheckCircle size={30} style={{ color: "var(--success-color)" }} /> : <FaCopy size={30} />}
      </button>
    </div>
  );
};

export default SocialShareButtons;
