import React from "react";

export const CornerMotifs: React.FC = () => {
  return (
    <>
      <svg className="corner-motif corner-tl" viewBox="0 0 100 100" fill="none">
        <path d="M5 5 Q5 40 40 40 Q5 40 5 75" stroke="#e8c766" strokeWidth="1" />
        <circle cx="5" cy="5" r="4" fill="#e8c766" />
      </svg>
      <svg className="corner-motif corner-tr" viewBox="0 0 100 100" fill="none">
        <path d="M5 5 Q5 40 40 40 Q5 40 5 75" stroke="#e8c766" strokeWidth="1" />
        <circle cx="5" cy="5" r="4" fill="#e8c766" />
      </svg>
      <svg className="corner-motif corner-bl" viewBox="0 0 100 100" fill="none">
        <path d="M5 5 Q5 40 40 40 Q5 40 5 75" stroke="#e8c766" strokeWidth="1" />
        <circle cx="5" cy="5" r="4" fill="#e8c766" />
      </svg>
      <svg className="corner-motif corner-br" viewBox="0 0 100 100" fill="none">
        <path d="M5 5 Q5 40 40 40 Q5 40 5 75" stroke="#e8c766" strokeWidth="1" />
        <circle cx="5" cy="5" r="4" fill="#e8c766" />
      </svg>
    </>
  );
};

export const DividerMotif: React.FC = () => {
  return (
    <div className="divider-motif">
      <div className="line"></div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" stroke="#c8992e" fill="#c8992e" />
      </svg>
      <div className="line"></div>
    </div>
  );
};
