import { FC, ReactNode } from 'react';
import styles from './page-wrapper.module.css';

type TPageWrapperProps = {
  title: string;
  children: ReactNode;
};

export const PageWrapper: FC<TPageWrapperProps> = ({ title, children }) => (
  <div className={styles.detailPageWrap}>
    <h3 className={`${styles.detailHeader} text text_type_main-large`}>
      {title}
    </h3>
    {children}
  </div>
);
