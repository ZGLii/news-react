import React from 'react';
import {Skeleton} from 'antd-mobile';
import './SkeletionAgain.less';

const SkeletonAgain = function SkeletonAgain() {
  return (
    <div className="skeleton-again-box">
      <Skeleton.Title animated />
      <Skeleton.Paragraph lineCount={5} animated />
    </div>
  );
};
export default SkeletonAgain;