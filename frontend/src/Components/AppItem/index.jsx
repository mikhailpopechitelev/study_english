import React from 'react';

import styles from './index.module.scss';
import { Card, H1, H2 } from '@salutejs/plasma-ui';
export const AppItem = ({ title, content, ...props }) => {
  return (
    <Card className={styles.root}>
      <h2 bold={true} className={styles.title}>
        {title}
      </h2>
      {props.children && <div className={styles.child}>{props.children}</div>}
    </Card>
  );
};
