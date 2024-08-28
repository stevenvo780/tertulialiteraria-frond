import React from 'react';
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

interface SocialShareButtonsProps {
  shareUrl: string;
  title: string;
  summary?: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ shareUrl, title, summary }) => {
  return (
    <div className="d-flex justify-content-around flex-wrap">
      <FacebookShareButton url={shareUrl} title={title} className="mb-2">
        <FacebookIcon size={60} round />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={title} className="mb-2">
        <TwitterIcon size={60} round />
      </TwitterShareButton>
      <WhatsappShareButton url={shareUrl} title={title} separator=":: " className="mb-2">
        <WhatsappIcon size={60} round />
      </WhatsappShareButton>
      <LinkedinShareButton url={shareUrl} title={title} summary={summary || ''} source={window.location.origin} className="mb-2">
        <LinkedinIcon size={60} round />
      </LinkedinShareButton>
      <TelegramShareButton url={shareUrl} title={title} className="mb-2">
        <TelegramIcon size={60} round />
      </TelegramShareButton>
    </div>
  );
};

export default SocialShareButtons;
