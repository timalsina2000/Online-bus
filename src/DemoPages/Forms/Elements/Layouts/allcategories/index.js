import React, { Fragment } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';


import PageTitle from "../../../../../Layout/AppMain/PageTitle";

import Tabs, { TabPane } from "rc-tabs";
import TabContent from "rc-tabs/lib/SwipeableTabContent";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";

// Examples

import FormGridFormRow from "./Examples/FormGridFormRow";


class FormElementsLayouts extends React.Component {
  render() {
    return (
      <Fragment>
        <TransitionGroup>
          <CSSTransition component="div" classNames="TabsAnimation" appear={true}
            timeout={1500} enter={false} exit={false}>
            <div>  
              <PageTitle heading="Form Categories"
                subheading="Categories"
                icon="pe-7s-graph text-success"/>
              <Tabs defaultActiveKey="1" renderTabBar={() => <ScrollableInkTabBar />} renderTabContent={() => <TabContent />}>
                <TabPane tab="All Categories" key="1">
                  <FormGridFormRow />
                </TabPane>
               
                
              </Tabs>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    );
  }
}

export default FormElementsLayouts;

