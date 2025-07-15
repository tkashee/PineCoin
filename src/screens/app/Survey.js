import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Chip, Grid, Typography } from '@mui/joy';
import SurveyStartCard from '../../components/SurveyStartCard'
import RunningSurveyCard from '../../components/RunningSurveyCard';
import { Paid, Timer, Topic } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { userObject, completedSurveys, surveyValidation, amountEarnedList, weekDaysList } from "../../state";
import LottieEarned from '../../components/LottieEarned';

export default function Survey() {
    const location = useLocation();
    const navigate = useNavigate()

    const [user, setUser] = useAtom(userObject)
    const [surveyCount, setSurveyCount] = useAtom(surveyValidation)
    const [, setDoneSurveys] = useAtom(completedSurveys)
    const [, setAmountList] = useAtom(amountEarnedList)
    const [, setDays] = useAtom(weekDaysList)

    const [surveyItem, setSurveyItem] = useState([]);
    const [startSurvey, setStartSurvey] = useState(false)
    const [time, setTime] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0)
    const [surveyComplete, setSurveyComplete] = useState(false)
    const [submitSurvey, setSubmitSurvey] = useState(false)





    setTimeout(() => {
        if (time == 0) {
            return
        } else setTime(time - 1)
    }, 1000)

    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            // do componentDidMount logic
            mounted.current = true;
        } else {
            // do componentDidUpdate logic
            if (questionIndex == surveyItem?.surveyQuestions?.length - 1) {
                setSubmitSurvey(true)
            }
        }
    });

    useEffect(() => {
        fetch('https://gist.githubusercontent.com/tkashee/a0e3eff5161da570972314ca25c78aab/raw/26d44d627776bf669862a8f98f944657077d80b9/data.json')
            .then(response => response.json())
            .then(data => {
                var dataFilteredSurvey = data.surveys.filter(item => item.surveyId == location.state.Id)
                setSurveyItem(dataFilteredSurvey[0])
            });
    }, []);


    const navigateHome = () => {
        navigate("/home")
    }


    const surveyStarted = () => {
        setStartSurvey(true)
        setTime(5)
    }
    const nextSurvey = () => {
        if (questionIndex < surveyItem.surveyQuestions.length) {
            setQuestionIndex(questionIndex + 1)
            setStartSurvey(true)
            setTime(5)
        }

        if (submitSurvey) {
            var dateNow = new Date().toLocaleDateString()
            var weekDay = new Date().toLocaleString('en-us', { weekday: 'short' })
            setDoneSurveys((survey) => [
                ...survey, {
                    date: dateNow,
                    earnedAmount: surveyItem.surveyAmount,
                    surveyId: surveyItem.surveyId
                }
            ])

            setAmountList((item) => [
                ...item, surveyItem.surveyAmount
            ])

            setDays((item) => [
                ...item, weekDay
            ])
            setUser((prev) => ({
                ...prev,
                accountBalance: user.accountBalance + surveyItem.surveyAmount
            }))
            if (surveyItem.surveyId != "1") {
                setSurveyCount((countNew) => ({
                    ...countNew,
                    date: dateNow,
                    count: surveyCount.count + 1
                }))
            }

            setSurveyComplete(true)
        }
    }


    return (
        < div >
            <Card variant="soft" style={{
                backgroundColor: "#FDBF00",

            }}>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid xs={6} md={6}>
                        <Typography align="left">
                            {
                                surveyComplete ? <span>You have earned</span> : <span>Survey Payout</span>
                            }
                        </Typography>
                        <Typography align="left" level="title-lg" >
                            <Chip align="right" size="lg" variant="outlined" color={
                                surveyComplete ? "success" : ""
                            }> Ksh {surveyItem.surveyAmount}</Chip>
                        </Typography>
                    </Grid>
                    <Grid xs={6} md={6}>
                        <Typography align="right">Survey Topic</Typography>
                        <Typography align="right" level="title-lg" >
                            <Chip align="right" size="lg" variant="outlined">
                                {surveyItem.surveyCategory}</Chip>
                        </Typography>
                    </Grid>
                    {
                        surveyComplete
                            ?
                            <div></div>
                            :
                            <div>
                                {
                                    startSurvey
                                        ?
                                        <Grid xs={6} md={6}>
                                            <Typography align="left"
                                                level="title-lg" >
                                                <Chip size="lg" variant="outlined" startDecorator={<Timer />}>
                                                    Next In : {time}
                                                </Chip>
                                            </Typography>
                                        </Grid>
                                        :
                                        <div></div>
                                }
                            </div>
                    }
                </Grid>
                {
                    surveyComplete
                        ?
                        <Card sx={{ mt: 1 }}>
                            <Alert
                                sx={{ m: 1 }}
                                variant="soft"
                                fontweight="bold"
                                color="success"

                            >
                                Congratulations you have earned Ksh {surveyItem.surveyAmount} .
                            </Alert>
                            <LottieEarned />
                            <Button style={{ backgroundColor: '#00CC71' }} onClick={navigateHome} sx={{ mt: 1 }} fullWidth>Continue</Button>
                        </Card>
                        :
                        <div>
                            {
                                startSurvey
                                    ?
                                    <RunningSurveyCard nextSurvey={nextSurvey} time={time} survey={surveyItem.surveyQuestions[questionIndex]} submitSurvey={submitSurvey} />
                                    :
                                    <SurveyStartCard surveyStarted={surveyStarted} amount={surveyItem.surveyAmount} />
                            }
                        </div>
                }
            </Card>
        </div >
    )
}
