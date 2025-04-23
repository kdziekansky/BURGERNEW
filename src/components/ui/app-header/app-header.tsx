import React, { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const isConstructor = location.pathname === '/';
  const isFeed = location.pathname === '/feed';
  const isProfile = location.pathname.includes('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            end
            className={({ isActive }) =>
              `${styles.link} mr-10 ${isActive ? styles.link_active : ''}`
            }
          >
            <BurgerIcon type={isConstructor ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${isConstructor ? '' : 'text_color_inactive'}`}
            >
              Конструктор
            </p>
          </NavLink>

          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon type={isFeed ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${isFeed ? '' : 'text_color_inactive'}`}
            >
              Лента заказов
            </p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ProfileIcon type={isProfile ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${isProfile ? '' : 'text_color_inactive'}`}
            >
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
