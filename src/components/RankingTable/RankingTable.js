
import React, {useState, useRef, useEffect} from 'react';
import {getRankingData, msToHmsFormat} from '../../utils/utils'
import { changeLogin } from '../../store';
import {
    RankingContainer, 
    BlankComment, 
    RankCircle, 
    RankCircleContainer, 
    FrontFace, 
    FrontContents, 
    BackFace, 
    MyRankContainer, 
    MyRankText,
    TotalPersonText,
    MyPercentText, 
    CircleTitle, 
    MedalImage, 
    RankTableContainer,
    StyledTable,
    StyledTd,
    StyledTh,
    StyledTr,
    StyledButton,
    ButtonContainer,
} from "./RankingTable.styled"

import goldMedal from "./assets/gold-medal.png"
import silverMedal from "./assets/silver-medal.png"
import bronzeMedal from "./assets/bronze-medal.png"
import {connect} from "react-redux";
function RankingTable ({currentUser, setIsLogin}) {
    const [userRanking, setUserRanking] = useState([]);
    const [myRanking, setMyRanking] = useState(0);
    const myRankRef = useRef();
    const headerRef = useRef();
    
    useEffect(()=> {
        getRankingData()
        .then((res) => {
            
            if(res.data.message === 'SUCCESS'){
                setMyRanking(parseInt(res.data.rank));
                setIsLogin(true);
                setUserRanking(
                    res.data.result.map((item, index) => {
                        return {
                            rank: index + 1,
                            nickname: item.nickname,
                            totalTime: msToHmsFormat(item.totalTime),
                        }        
                }))
            }
        })
        .catch((error) => {
            console.log(error);
            setIsLogin(false);
            // setIsLogin(true);
        })
        
        
    }, [])

    const addMedalImage = (myRanking, size, type) => {
        if(myRanking === 1){
            return <MedalImage type={type} src={goldMedal} width={size} height={size} alt="goldMedal"/>;
        }
        else if(myRanking === 2){
            return <MedalImage type={type} src={silverMedal} width={size} height={size} alt="silverMedal"/>;
        }
        else if(myRanking === 3){
            return <MedalImage type={type} src={bronzeMedal} width={size} height={size} alt="bronzeMedal"/>;
        }
        else{
            return null;
        }
    }

    const goMyRank = () => {
        myRankRef.current.scrollIntoView({ behavior: 'smooth'});
        setTimeout(() => {
            myRankRef.current.classList.add("animate__animated");
            myRankRef.current.classList.add("animate__flash");
            setTimeout(() => {
                myRankRef.current.classList.remove("animate__animated");
                myRankRef.current.classList.remove("animate__flash");
            }, 1000);
        }, 500)
        
    }
    
    const goHeader = () => {
        headerRef.current.scrollIntoView({ behavior: 'smooth'});
    }
    const rankingCirclePart = (
    <RankCircleContainer>
        <RankCircle className="rank-circle">
            <BackFace>
                <CircleTitle type="back">상위</CircleTitle>
                <MyPercentText>{Math.ceil(myRanking / userRanking.length * 100)}</MyPercentText>   
                
            </BackFace>
            <FrontFace>
                <FrontContents>
                    <CircleTitle type="front">{currentUser.length > 7 ? currentUser.substring(0, 7) + "⋯" : currentUser}</CircleTitle>
                    <MyRankContainer>
                        {addMedalImage(myRanking, 64, 'rankCircle')}
                        <MyRankText>{myRanking}</MyRankText>
                        <TotalPersonText>/{userRanking.length}</TotalPersonText>
                    </MyRankContainer>
                </FrontContents>
            </FrontFace>
            
        </RankCircle>
    </RankCircleContainer>);

    const rankingTablePart = (
        <>
        <ButtonContainer>
        <StyledButton onClick={goMyRank}>내 순위</StyledButton>|
        <StyledButton onClick={goHeader}>맨 위로</StyledButton>
        </ButtonContainer>
        <RankTableContainer>
        <div ref={headerRef}></div>
        <StyledTable>
            <thead>
                <StyledTr>
                <StyledTh>순위</StyledTh>
                <StyledTh>닉네임</StyledTh>
                <StyledTh>학습시간(HH:MM:SS)</StyledTh>
                </StyledTr>
            </thead>
            <tbody>
                
                {userRanking.map(item => {
                    return (<StyledTr 
                    ref={item.rank === myRanking ? myRankRef : null}
                    myRank={item.rank === myRanking ? true : false}>
                        <StyledTd data-label="순위">{item.rank < 4 ? addMedalImage(item.rank, 32, 'rankTable') : item.rank}</StyledTd>
                        <StyledTd data-label="닉네임">
                            {item.nickname}
                        </StyledTd>
                        <StyledTd data-label="학습시간">
                            {item.totalTime}
                        </StyledTd>
                    </StyledTr>);
                })}
            </tbody>
        </StyledTable>
        </RankTableContainer>
        </>
    );

    return (
        <RankingContainer>
            {myRanking > 0 ?
                rankingCirclePart:
                null
            }
            {myRanking > 0 ? 
                rankingTablePart
                // <Table columns={columns} dataSource={userRanking} /> 
                : 
                <BlankComment>오늘 학습 기록이 없어<br/> 순위를 확인할 수 없습니다.</BlankComment>
            }
        </ RankingContainer>
    );

}

function mapStateToProps(state){
    return{
        currentUser : state.currentUser,
        isLogin : state.isLogin,
    };
}

function mapDispatchToProps(dispatch){
    return{
        setIsLogin : isLogin => dispatch(changeLogin(isLogin))
    };
}

export default connect(mapStateToProps,mapDispatchToProps) (RankingTable);
