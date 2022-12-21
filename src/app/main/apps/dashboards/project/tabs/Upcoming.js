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
import { Avatar, CircularProgress, FormControl, Icon, IconButton, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import React from 'react';
import ds from '../../../../../services/DataService';
import { showMessage } from 'app/store/fuse/messageSlice';
import moment from 'moment';
import { DateTimeFormat } from 'app/auth/store/constants';

function Upcoming() {
  const dispatch = useDispatch();

  const [loader, setLoader] = React.useState(false);
  const [weekdata, setWeekData] = React.useState([]);

  // React.useEffect(() => {
  //   let mounted = true;
  //   if (mounted) {
  //     scoreboardService();
  //   }

  //   return () => mounted = false;
  // }, []);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  function callForward(list) {
    if (list && list.length > 0) {
      list.map((a, l) => {
        if (a.$ref) {
          dynamicService(a.$ref, l == 15);
        }
      });
      setLoader(false);
    }
  }

  async function upcomingService(body) {
    setLoader(true);
    const getReq = ds.nflWeekService(body);
    await getReq
      .then(res => {
        // setLoader(false);
        if (res && res.items && res.items.length > 0) {
          callForward(res.items);
        }
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

  async function dynamicService(body, isLast) {
    setLoader(true);
    const getReq = ds.nflDynamicService(body);
    await getReq
      .then(res => {
        // if (isLast) setLoader(false);
        if (res) {
          setWeekData(oldPosts => [...oldPosts, res]);
          // const da = [...weekdata];
          // setWeekData(da.concat(res));
        }
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

  function handleChange(e) {
    const asd = weekdata;
    setWeekData([]);
    upcomingService(e.target.value);
  }

  return (
    <motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">

      <div className="p-16 sm:p-24 max-w-2xl">
        <motion.div variants={item} className="widget flex w-full mb-12">
          <div className="flex items-center justify-between">
            <Typography className="text-18 px-16 font-semibold">
              NFL WEEKS
            </Typography>
          </div>
        </motion.div>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Select week</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem key={1} value={1}>Week 1</MenuItem>
            <MenuItem key={2} value={2}>Week 2</MenuItem>
            <MenuItem key={3} value={3}>Week 3</MenuItem>
            <MenuItem key={4} value={4}>Week 4</MenuItem>
            <MenuItem key={5} value={5}>Week 5</MenuItem>
            <MenuItem key={13} value={6}>Week 6</MenuItem>
            <MenuItem key={112} value={7}>Week 7</MenuItem>
            <MenuItem key={1122} value={8}>Week 8</MenuItem>
            <MenuItem key={113} value={9}>Week 9</MenuItem>
            <MenuItem key={321} value={10}>Week 10</MenuItem>
            <MenuItem key={153} value={11}>Week 11</MenuItem>
            <MenuItem key={1345} value={12}>Week 12</MenuItem>
            <MenuItem key={2341} value={13}>Week 13</MenuItem>
            <MenuItem key={1453} value={14}>Week 14</MenuItem>
            <MenuItem key={157} value={15}>Week 15</MenuItem>
            <MenuItem key={1789} value={16}>Week 16</MenuItem>
            <MenuItem key={14568} value={17}>Week 17</MenuItem>
            <MenuItem key={1077} value={18}>Week 18</MenuItem>
          </Select>
        </FormControl>

        <Typography className="px-16 font-medium mt-12 mb-24">
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
              {weekdata && weekdata.length > 0 &&
                weekdata.map((a, i) => {
                  return (
                    <div key={i} className={`m-12 p-12`} style={{ background: '#e2d8d8' }}>
                      <Typography className="text-16 px-16 font-medium text-center" color="textSecondary">
                        {a.date ? moment(a.date).format(DateTimeFormat) : ""}
                      </Typography>
                      <div className="text-center py-12">
                        <Typography className="text-18 font-semibold leading-none text-blue tracking-tighter text-center">

                          {"SHORT NAME: "}
                          {a.shortName ? a.shortName : ""}
                        </Typography>
                        <Typography className="text-14 font-semibold text-green-800">
                          {a.name ? a.name : ""}
                        </Typography>
                      </div>
                    </div>
                  )
                })}
            </>}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Upcoming;
