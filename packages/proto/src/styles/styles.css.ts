import { css } from 'lit';

export default {
    styles: css`
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    img {
      max-width: 100%;
      display: block;
    }
    ul, ol, menu {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    body {
      line-height: 1.5;
    }
    svg {
      max-width: 100%;
    }
  `
};