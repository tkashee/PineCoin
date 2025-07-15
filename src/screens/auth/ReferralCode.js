import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";
import { Card, LinearProgress, Container, Typography, Box, Grid, Button, ListDivider } from "@mui/joy";
import logo from "../../assets/logo.png"


export default function ReferralCode() {
  const navigate = useNavigate()
  const [showProgressDialog, setProgressDialog] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const referralCode = data.get('referralCode');
    if (!validateReferralCode(referralCode)) {
      setCodeError(true);
      return
    }
    navigate("/account")
  };

  const validateReferralCode = (code) => {
    // Assuming the referral code should be exactly 10 characters long and alphanumeric
    const codeFormat = /^[A-Z0-9]{10}$/;
    return codeFormat.test(code);
  };



  return (

    <Container component="main" maxWidth="xs">

      <Card
        size="lg"
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          className="neon-logo"
          sx={{
            height: 20,
            width: 75,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          alt="The house from the offer."
          src={logo}
        />
        <ListDivider />
        <Typography fontWeight={"bold"} level="h4">
          Get 200 Loyalty Points
        </Typography>
        <Typography>
          If you are invited by someone, please enter your invitation code to earn your first 10 credits
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            name="referralCode"
            required
            fullWidth
            id="referralCode"
            label="Referral Code"
            error={codeError}
            helperText={codeError ? "Please enter a valid code" : ""}
            autoFocus
          />

          {
            showProgressDialog ? <LinearProgress sx={{ mt: 1 }} /> : <div></div>
          }

          <Button
            type="submit"
            fullWidth
            variant="solid"
            style={{ backgroundColor: '#FE6B35', borderRadius: "5em", boxShadow: '0 0 8px #FE6B35' }}
            sx={{
              mt: 3,
              mb: 2,
              '&:hover': {
                backgroundColor: '#FF7A4A',
                boxShadow: '0 0 12px #FF7A4A',
              }
            }}
          >
            Submit
          </Button>
          <Grid container >
            <Grid item>
              <Link style={{ color: '#FE6B35', borderRadius: "5em", textShadow: '0 0 6px #FE6B35' }} href="/home" variant="body1"
                sx={{
                  '&:hover': {
                    color: '#FF7A4A',
                    textShadow: '0 0 8px #FF7A4A',
                  }
                }}
              >
                I don't have a referral code
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Card>

    </Container>

  );
}
