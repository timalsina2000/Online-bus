import React, { Fragment } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import PageTitle from "../../../../../Layout/AppMain/PageTitle";


import Tabs, { TabPane } from "rc-tabs";

import TabContent from "rc-tabs/lib/SwipeableTabContent";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";

// Examples

import FormGrid from "./Examples/FormGrid";
 // Assuming you have this component for adding new posts

class FormElementsLayouts1 extends React.Component {
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
               
                <TabPane tab="New Categories" key="2">
                  <FormGrid /> {/* Assuming this component shows new categories */}
                </TabPane>
               
              </Tabs>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    );
  }
}

export default FormElementsLayouts1;

