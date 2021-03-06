import React from 'react';
import DashCard from "../../DashCard";
import {Carousel, Row, Col} from 'antd';
import * as priceengine from '../../../actions/priceengine';
import * as utils from '../../../actions/utils';
import * as race_contract from '../../../actions/race_contract_integration';

export const RaceCarousel = (props) => {
  const {races, eventHandler, completedCallback, phase, selectedRaceId} = props;

  const leadingCoin = (race) => {
    if(phase === 'completed' && utils.nonNull(race_contract.winning_coins[race.id])){
      const winningCoins = race_contract.winning_coins[race.id];
      for (let i = 0; i < priceengine.getAvailableCoins().length; i++) {
        if (priceengine.getAvailableCoins()[i].id === winningCoins[0]) {
          return priceengine.getAvailableCoins()[i].symbol;
        }
      }
    }else if (priceengine.hasPrice(race.id)) {
      const prices = priceengine.getPriceInfo(race.id);
      return prices.coins[0].symbol;
    } else {
      let coin = undefined;
      for (let i = 0; i < priceengine.getAvailableCoins().length; i++) {
        if (priceengine.getAvailableCoins()[i].id === race.coinIds[0]) {
          coin = priceengine.getAvailableCoins()[i];
          break;
        }
      }
      return coin === undefined ? '' : coin.symbol;
    }
  };

  const getStartTime = (race) => {
    if (phase === 'upcoming') {
      return new Date().getTime() / 1000;
    } else if (phase === 'betting') {
      return race.bStartTime;
    } else { //phase === 'running' or phase === 'completed' at this point
      return race.startTime;
    }
  };

  const getEndTime = (race) => {
    if (phase === 'upcoming') {
      return race.bStartTime;
    } else if (phase === 'betting') {
      return race.startTime;
    } else {//phase === 'running' or phase === 'completed' at this point
      return race.startTime + race.duration;
    }
  };

  const getDuration = (race) => {
    if (phase === 'upcoming') {
      return (race.bStartTime - new Date().getTime() / 1000) > 0 ? (race.bStartTime - new Date().getTime() / 1000) : 0;
    } else if (phase === 'betting') {
      return race.startTime - race.bStartTime;
    } else {//phase === 'running' or phase === 'completed' at this point
      return race.duration;
    }
  };
  return (
          <Row>
            <Col sm={1}>
            </Col>
            <Col sm={19}>
              <Carousel {...utils.CarouselDefaultSettings}>
                {races.map(r => <div className="dash-card" key={utils.id()}>
                  <DashCard key={r.id}
                            selectedRaceId={selectedRaceId}
                            title={r.name}
                            numericId={r.numericId}
                            completedCallback={completedCallback}
                            raceId={r.id}
                            leadingCoin={leadingCoin(r)}
                            cardClickEventHandler={eventHandler}
                            coinImg={r.coinIds[0]}
                            participatingCoins={r.coinIds}
                            endTime={getEndTime(r)}
                            startTime={getStartTime(r)}
                            duration={getDuration(r)} {...this.props} /></div>)}
              </Carousel></Col>
            <Col sm={1}>
            </Col>
          </Row>
  );
};