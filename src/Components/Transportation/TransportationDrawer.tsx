import DeleteIcon from '@mui/icons-material/Delete';
import SwipeUpIcon from '@mui/icons-material/SwipeUp';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  SwipeableDrawer,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import { arrayRemove } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useState } from 'react';
import QRCode from 'react-qr-code';

import { AuthType, useAuth } from '../../Contexts/AuthContext';
import { db } from '../../Firebase/config';
import useDoc from '../../Hooks/useDoc';

const drawerBleeding = 56;
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

type TicketType = {
  code: string;
  name: string;
  expiryDate: Timestamp;
};

const TransportationDrawer = () => {
  const [open, setOpen] = useState(false); // Open swiper
  const { user } = useAuth() as AuthType;

  const tickets = useDoc('transportationIDS');

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  // Delete ticket from database and refresh drawer
  const handleDelete = (item: TicketType) => {
    const docRef = doc(db, 'users', user!.uid);
    updateDoc(docRef, {
      transportationIDS: arrayRemove(item),
    });
  };

  // Calculate ticket expiration date
  const calculateDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return (
      date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    );
  };
  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
          zIndex: '2',
          bottom: '56px',
          width: '30px',
          color: '#F1DAC4',
        }}
        size="large"
        disableRipple={true}
      >
        <SwipeUpIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        disableDiscovery={true}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              p: 2,
              color: 'text.primary',
              textAlign: 'center',
            }}
          >
            Your Tickets
          </Typography>
        </StyledBox>
        <StyledBox
          className="transportation-box"
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Grid
            container
            sx={{ justifyContent: 'center', alignItems: 'center' }}
          >
            {tickets.map((item: TicketType) => (
              <Grid
                item
                component={motion.div}
                layout
                xs={12}
                md={7}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: '25px',
                  paddingTop: '25px',
                }}
                key={item.code}
              >
                <Paper
                  elevation={3}
                  sx={{
                    backgroundColor: '#161b33',
                    maxWidth: '600px',
                    minWidth: '70%',
                  }}
                >
                  <Grid container>
                    <Typography
                      sx={{
                        width: '100%',
                        textAlign: 'center',
                        paddingTop: '25px',
                      }}
                      variant="h5"
                      gutterBottom
                      component="div"
                    >
                      {item.name}
                    </Typography>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <QRCode value={item.code} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        sx={{
                          width: '100%',
                          textAlign: 'center',
                        }}
                        variant="h5"
                      >
                        Expiry date: {calculateDate(item.expiryDate)}
                      </Typography>

                      <IconButton
                        aria-label="delete"
                        sx={{ color: '#F1DAC4' }}
                        onClick={() => handleDelete(item)}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </StyledBox>
      </SwipeableDrawer>
    </>
  );
};

export default TransportationDrawer;
