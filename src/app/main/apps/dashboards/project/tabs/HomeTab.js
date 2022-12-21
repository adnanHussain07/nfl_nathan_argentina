import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { selectWidgets } from '../store/widgetsSlice';
import Widget1 from '../widgets/Widget1';
import Widget2 from '../widgets/Widget2';
import Widget3 from '../widgets/Widget3';
import Widget4 from '../widgets/Widget4';
import Widget5 from '../widgets/Widget5';
import Widget6 from '../widgets/Widget6';
import Widget7 from '../widgets/Widget7';
import { Avatar, CircularProgress, Icon, IconButton, Paper, Typography } from '@mui/material';
import React from 'react';
import ds from '../../../../../services/DataService';
import { showMessage } from 'app/store/fuse/messageSlice';
import moment from 'moment';
import { DateTimeFormat } from 'app/auth/store/constants';

function HomeTab() {
  const dispatch = useDispatch();

  const [loader, setLoader] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    if (mounted) {
      scoreboardService();
    }

    return () => mounted = false;
  }, []);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  async function scoreboardService(body) {
    setLoader(true);
    const getReq = ds.nflServiceScoreboard(body);
    await getReq
      .then(res => {
        // debugger
        if (res && res.sports && res.sports.length > 0) {
          if (res.sports[0].leagues && res.sports[0].leagues.length > 0) {
            setData(res.sports[0].leagues[0]);
          }
        }
        setLoader(false);
      })
      .catch(e => {
        setLoader(false);
        dispatch(
          showMessage({
            message: `Something went wrong`,
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: `${'warning'}` //success error info warning null
          })
        );
      });
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
      <div className="p-16 sm:p-24 max-w-2xl">
        <motion.div variants={item} className="widget flex w-full">
          <div className="flex items-center justify-between">
            <Typography className="text-18 px-16 font-semibold">
              NFL SCOREBOARD DATA FETCH
            </Typography>
          </div>
        </motion.div>

        <Typography className="px-16 font-medium">
          EVENTS
        </Typography>



        <motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
          {loader ? <CircularProgress
            style={{
              marginTop: '12%',
              marginLeft: '40%',
              width: 48,
              height: 48,
              marginBottom: 80,
            }}
            color="secondary"
          /> :
            <>
              {data && data.events && data.events.length > 0 &&
                data.events.map((a, i) => {
                  return (
                    <motion.div key={i} variants={item} className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
                      <Paper className="w-full rounded-20 shadow flex flex-col justify-between">
                        <div className="flex items-center justify-between px-4 pt-8">
                          <Typography className="text-16 px-16 font-medium" color="textSecondary">
                            {a.date ? moment(a.date).format(DateTimeFormat) : ""}
                          </Typography>
                          <IconButton aria-label="more" size="large">
                            <Icon>sports_football</Icon>
                          </IconButton>
                        </div>
                        <div className="text-center py-12">
                          <Typography className="text-24 font-semibold leading-none text-red tracking-tighter text-center">
                            <Avatar
                              className="w-52 h-52 sm:w-64 sm:h-64"
                              style={{ marginLeft: '40%' }}
                              alt="user photo"
                              src={a.competitors && a.competitors.length > 0
                                && a.competitors[0].logo ? a.competitors[0].logo : ''
                              } />
                            {a.competitors && a.competitors.length > 0
                              && a.competitors[0].homeAway ? a.competitors[0].homeAway : ""}
                          </Typography>
                          <Typography className="text-18 font-normal text-red-800">
                            {a.competitors && a.competitors.length > 0
                              && a.competitors[0].displayName ? a.competitors[0].displayName : ""}
                          </Typography>
                          <Typography className="text-24 font-semibold leading-none text-red tracking-tighter text-center">
                            <Avatar
                              className="w-52 h-52 sm:w-64 sm:h-64"
                              style={{ marginLeft: '40%' }}
                              alt="user photo"
                              src={a.competitors && a.competitors.length > 1
                                && a.competitors[1].logo ? a.competitors[1].logo : ''
                              } />
                            {a.competitors && a.competitors.length > 0
                              && a.competitors[1].homeAway ? a.competitors[1].homeAway : ""}
                          </Typography>
                          <Typography className="text-18 font-normal text-red-800">
                            {a.competitors && a.competitors.length > 0
                              && a.competitors[1].displayName ? a.competitors[1].displayName : ""}
                          </Typography>

                          {a.competitors && a.competitors.length > 0 &&
                            a.competitors.filter(a => a.winner).length > 0 &&
                            (
                              <>
                                <Typography className="text-18 font-normal text-blue-800">
                                  WINNER IS
                                </Typography>
                                <Typography className="text-24 font-semibold leading-none text-green tracking-tighter text-center">
                                  {a.competitors.filter(a => a.winner)[0].displayName ?
                                    a.competitors.filter(a => a.winner)[0].displayName : ""}
                                  <Avatar
                                    className="w-52 h-52 sm:w-64 sm:h-64"
                                    style={{ marginLeft: '40%' }}
                                    alt="user photo"
                                    src={a.competitors.filter(a => a.winner)[0].logo ?
                                      a.competitors.filter(a => a.winner)[0].logo : ''
                                    } />
                                </Typography>
                              </>
                            )}
                        </div>
                        <Typography
                          className="p-20 pt-0 h-56 flex justify-center items-end text-13 font-medium"
                          color="textSecondary"
                        >
                          <span className="truncate">Location </span>:
                          <b className="px-8">{a.location ? a.location : ""}</b>
                        </Typography>
                      </Paper>
                    </motion.div>
                  )
                })}
            </>}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HomeTab;
