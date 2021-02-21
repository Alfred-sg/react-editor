import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import './index.scss';

export default ({
  id,
  type,
  content,
}) => {
  let elem = null;

  switch(type){
    case 'h3':
      elem = (
        <h3 data-id={id}>
          {content}
        </h3>
      );
      break;
    case 'text':
      elem = (
        <p data-id={id}>
          {content}
        </p>
      );
      break;
  }

  return elem;
}