import React from "react";

const LoadingAnimation = ({ fullScreen = false, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-100 bg-opacity-80 backdrop-blur-sm">
        <span className="loading loading-spinner loading-lg text-primary mb-4 p-8"></span>
        {text && <p className="text-lg font-medium opacity-80">{text}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 w-full h-full min-h-[150px]">
      <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
      {text && <p className="text-sm font-medium opacity-70">{text}</p>}
    </div>
  );
};

export default LoadingAnimation;
