import React from "react";
import { Button } from "antd";
import { Helmet, useIntl } from "umi";
import styles from "./discontinue.less";

const Page: React.FC = () => {
  const { formatMessage } = useIntl();
  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: "title.discontinue" })}</title>
      </Helmet>
      <div className={styles.wrapper}>
        <svg width="210px" height="100px" viewBox="0 0 210 100" version="1.1">
          <g
            id="DataDisplay-/-Empty-/-Warring"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Illustration-/-Gift"
              transform="translate(2.000000, 0.000000)"
              fill="#E3E3E3"
            >
              <path
                d="M42,96 L158,96 C159.104569,96 160,96.8954305 160,98 C160,99.1045695 159.104569,100 158,100 L42,100 C40.8954305,100 40,99.1045695 40,98 C40,96.8954305 40.8954305,96 42,96 Z"
                id="Rectangle-4"
              ></path>
              <path
                d="M184,28 C185.104569,28 186,28.8954305 186,30 L186,34 L190,34 C191.104569,34 192,34.8954305 192,36 C192,37.1045695 191.104569,38 190,38 L186,38 L186,42 C186,43.1045695 185.104569,44 184,44 C182.895431,44 182,43.1045695 182,42 L182,38 L178,38 C176.895431,38 176,37.1045695 176,36 C176,34.8954305 176.895431,34 178,34 L182,34 L182,30 C182,28.8954305 182.895431,28 184,28 Z"
                id="Rectangle-4"
              ></path>
              <path
                d="M54,0 C55.1045695,-2.02906125e-16 56,0.8954305 56,2 L56,4 L58,4 C59.1045695,4 60,4.8954305 60,6 C60,7.1045695 59.1045695,8 58,8 L56,8 L56,10 C56,11.1045695 55.1045695,12 54,12 C52.8954305,12 52,11.1045695 52,10 L52,8 L50,8 C48.8954305,8 48,7.1045695 48,6 C48,4.8954305 48.8954305,4 50,4 L52,4 L52,2 C52,0.8954305 52.8954305,2.02906125e-16 54,0 Z"
                id="Rectangle-4"
              ></path>
              <path
                d="M6,62 C1.581722,62 -2,65.581722 -2,70 C-2,74.418278 1.581722,78 6,78 C10.418278,78 14,74.418278 14,70 C14,65.581722 10.418278,62 6,62 Z M6,66 C8.209139,66 10,67.790861 10,70 C10,72.209139 8.209139,74 6,74 C3.790861,74 2,72.209139 2,70 C2,67.790861 3.790861,66 6,66 Z"
                id="Oval"
                fillRule="nonzero"
              ></path>
              <circle id="Oval-2" cx="204" cy="72" r="4"></circle>
            </g>
            <circle id="Oval" fill="#CCCCCC" cx="106" cy="67" r="3"></circle>
            <path
              d="M104.285014,16.9710085 L68.2850141,76.9710085 C67.4851847,78.3040575 68.445411,80 70,80 L142,80 C143.554589,80 144.514815,78.3040575 143.714986,76.9710085 L107.714986,16.9710085 C106.938179,15.6763305 105.061821,15.6763305 104.285014,16.9710085 Z M106,21.885 L138.468,76 L73.531,76 L106,21.885 Z"
              id="Triangle"
              fill="#E3E3E3"
              fillRule="nonzero"
            ></path>
            <path
              d="M107,38 L105,38 C103.85183,38 102.93939,38.9645379 103.003079,40.11094 L104.003079,58.11094 C104.14301,60.6296867 107.85699,60.6296867 107.996921,58.11094 L108.996921,40.11094 C109.06061,38.9645379 108.14817,38 107,38 Z"
              id="Rectangle"
              fill="#CCCCCC"
              fillRule="nonzero"
            ></path>
          </g>
        </svg>
        <div>{formatMessage({ id: "tips.discontinue" })}</div>
      </div>
    </>
  );
};

export default Page;
