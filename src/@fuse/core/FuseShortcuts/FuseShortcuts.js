import { amber } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { selectFlatNavigation } from 'app/store/fuse/navigationSlice';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { memo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateUserShortcuts } from 'app/auth/store/userSlice';
import { Menus } from 'app/auth/store/constants';
import i18next from 'i18next';
import Popover from '@mui/material/Popover';
import { changeShowResetPass, setShowDeposit, setShowTwoFA, setShowWithdraw } from 'app/auth/store/sharedData';

function FuseShortcuts(props) {
  const dispatch = useDispatch();
  const shortcuts = useSelector(({ auth }) => auth.user.data.shortcuts) || [];
  const navigation = useSelector(selectFlatNavigation);

  const searchInputRef = useRef(null);
  const [addMenu, setAddMenu] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [settings, setSettings] = useState(null);
  const [earn, setEarn] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  // const shortcutItems = shortcuts
  //   ? shortcuts.map((id) => navigation.find((item) => item.id === id))
  //   : [];
  const shortcutItems = navigation && navigation.length > 0 ?
    navigation : [];

  function addMenuClick(event) {
    setAddMenu(event.currentTarget);
  }

  function addMenuClose() {
    setAddMenu(null);
  }

  function search(ev) {
    const newSearchText = ev.target.value;

    setSearchText(newSearchText);

    if (newSearchText.length !== 0 && navigation) {
      setSearchResults(
        navigation.filter((item) => item.title.toLowerCase().includes(newSearchText.toLowerCase()))
      );
      return;
    }
    setSearchResults(null);
  }

  function toggleInShortcuts(id) {
    let newShortcuts = [...shortcuts];
    newShortcuts = newShortcuts.includes(id)
      ? newShortcuts.filter((_id) => id !== _id)
      : [...newShortcuts, id];
    dispatch(updateUserShortcuts(newShortcuts));
  }

  function ShortcutMenuItem({ item, onToggle }) {
    return (
      <Link to={item.url} role="button">
        <MenuItem key={item.id}>
          <ListItemIcon className="min-w-40">
            {item.icon ? (
              <Icon>{item.icon}</Icon>
            ) : (
              <span className="text-20 font-semibold uppercase text-center">{item.title[0]}</span>
            )}
          </ListItemIcon>
          <ListItemText primary={item.title} />
          <IconButton
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              onToggle(item.id);
            }}
            size="large"
          >
            <Icon color="action">{shortcuts.includes(item.id) ? 'star' : 'star_border'}</Icon>
          </IconButton>
        </MenuItem>
      </Link>
    );
  }
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.6 },
    show: { opacity: 1, scale: 1 },
  };

  const settingClick = (event, id) => {
    setSettings(event.currentTarget);
  };

  const settingClose = () => {
    setSettings(null);
  };

  const earnClick = (event, id) => {
    setEarn(event.currentTarget);
  };

  const earnClose = () => {
    setEarn(null);
  };

  function onMenuClick(e) {
    settingClose();
    if (e.id && e.id == Menus.CHANGEPASS) dispatch(changeShowResetPass(true))
    else if (e.id && e.id == Menus.TWOFASEC) dispatch(setShowTwoFA(true))
    else if (e.id && e.id == Menus.DEPOSITNOW) dispatch(setShowDeposit(true))
    else if (e.id && e.id == Menus.WITHDRAWNOE) dispatch(setShowWithdraw(true));
  }

  return (
    <div
      className={clsx(
        'flex flex-1',
        props.variant === 'vertical' && 'flex-col flex-grow-0 flex-shrink',
        props.className
      )}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={clsx('flex flex-1', props.variant === 'vertical' && 'flex-col')}
      >
        {/* {shortcutItems.filter(a => !a.isChildren).map(
          (_item) =>
            _item && (
              <Link to={_item.id == Menus.CHANGEPASS
                || _item.id == Menus.TWOFASEC
                || _item.id == Menus.DEPOSITNOW
                || _item.id == Menus.WITHDRAWNOE
                ? '#' : _item.url} key={_item.id} role="button">
                <Tooltip
                  title={_item.title}
                  placement={props.variant === 'horizontal' ? 'bottom' : 'left'}
                >
                  <IconButton
                    className="w-40 h-40 p-0"
                    component={motion.div}
                    variants={item}
                    size="large"
                    onClick={() => onMenuClick(_item)}
                  >
                    {_item.icon ? (
                      <Icon>{_item.icon}</Icon>
                    ) : (
                      <span className="text-20 font-semibold uppercase">{_item.title[0]}</span>
                    )}
                  </IconButton>
                </Tooltip>
              </Link>
            )
        )} */}

        {/* dropdown icons earn */}
        {/* {shortcutItems && shortcutItems.length > 0 &&
          shortcutItems.filter(b => b.id == Menus.DEPOSITNOW
            || b.id == Menus.WITHDRAWNOE
            || b.id == Menus.DEPHISTORY
            || b.id == Menus.WITHHISTORY
          ).length > 0 && (
            <Tooltip
              title={i18next.t(`navigation:EARN`)}
              placement={props.variant === 'horizontal' ? 'bottom' : 'left'}
            >
              <IconButton
                component={motion.div}
                variants={item}
                className="w-40 h-40 p-0"
                // style={{ background: settingBgColor }}
                aria-haspopup="true"
                onClick={(e) => earnClick(e, Menus.EARN)}
                size="large"
              >
                <Icon>monetization_on</Icon>
              </IconButton>
            </Tooltip>
          )}

        <Popover
          open={Boolean(earn)}
          anchorEl={earn}
          onClose={earnClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          classes={{
            paper: 'py-8',
          }}
        >
          <>
            {shortcutItems.filter(rr => rr.id == Menus.DEPOSITNOW).length > 0 && (
              <MenuItem
                onClick={() => onMenuClick(shortcutItems.filter(rr => rr.id == Menus.DEPOSITNOW)[0])}
                component={Link}
                to={shortcutItems.filter(rr => rr.id == Menus.DEPOSITNOW)[0].url}
                role="button"
              >
                <ListItemIcon className="min-w-40">
                  <Icon>{shortcutItems.filter(rr => rr.id == Menus.DEPOSITNOW)[0].icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={shortcutItems.filter(rr => rr.id == Menus.DEPOSITNOW)[0].title} />
              </MenuItem>
            )}
            {shortcutItems.filter(rr => rr.id == Menus.WITHDRAWNOE).length > 0 && (
              <MenuItem
                onClick={() => onMenuClick(shortcutItems.filter(rr => rr.id == Menus.WITHDRAWNOE)[0])}
                component={Link}
                to={shortcutItems.filter(rr => rr.id == Menus.WITHDRAWNOE)[0].url}
                role="button"
              >
                <ListItemIcon className="min-w-40">
                  <Icon>{shortcutItems.filter(rr => rr.id == Menus.WITHDRAWNOE)[0].icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={shortcutItems.filter(rr => rr.id == Menus.WITHDRAWNOE)[0].title} />
              </MenuItem>
            )}
            {shortcutItems.filter(rr => rr.id == Menus.DEPHISTORY).length > 0 && (
              <MenuItem
                onClick={() => onMenuClick(shortcutItems.filter(rr => rr.id == Menus.DEPHISTORY)[0])}
                component={Link}
                to={shortcutItems.filter(rr => rr.id == Menus.DEPHISTORY)[0].url}
                role="button"
              >
                <ListItemIcon className="min-w-40">
                  <Icon>{shortcutItems.filter(rr => rr.id == Menus.DEPHISTORY)[0].icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={shortcutItems.filter(rr => rr.id == Menus.DEPHISTORY)[0].title} />
              </MenuItem>
            )}
            {shortcutItems.filter(rr => rr.id == Menus.WITHHISTORY).length > 0 && (
              <MenuItem
                onClick={() => onMenuClick(shortcutItems.filter(rr => rr.id == Menus.WITHHISTORY)[0])}
                component={Link}
                to={shortcutItems.filter(rr => rr.id == Menus.WITHHISTORY)[0].url}
                role="button"
              >
                <ListItemIcon className="min-w-40">
                  <Icon>{shortcutItems.filter(rr => rr.id == Menus.WITHHISTORY)[0].icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={shortcutItems.filter(rr => rr.id == Menus.WITHHISTORY)[0].title} />
              </MenuItem>
            )}
          </>
        </Popover> */}
        
        {/* <div className="logo" style={{ marginLeft: "25%" }}>
          <img width="128" src="assets/images/logos/fuse.svg" alt="logo" />
        </div> */}
      </motion.div>
    </div>
  );
}

FuseShortcuts.propTypes = {};
FuseShortcuts.defaultProps = {
  variant: 'horizontal',
};

export default memo(FuseShortcuts);
