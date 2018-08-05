import React, {Component} from 'react';
import ResolutionForms from './resolutions/ResolutionForms.jsx';
import ReadyOrderSingle from './resolutions/ReadyOrderSingle.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import NewEntry from './resolutions/NewEntry.jsx';
import OrderResolution from './resolutions/OrderResolution.jsx';

export default class ReadyOrders extends TrackerReact(React.Component) {
	constructor(){
		super();

		this.state = {
			subscription:{
				mycollections: Meteor.subscribe("userResolutions"),
				currOrders: Meteor.subscribe("allOrders"),
				showPopup: false
			}
		}		
  		this.updateNow = this.updateNow.bind(this);	
  	}
  	updateNow(id,itemid){
  		
  		var array=this.currOrderId(id)[0].items;
		var flags = [], output = [], l = array.length, i;
		for( i=0; i<l; i++) {
			if (array[i].itemid === itemid && !array[i].ready) {
      		 	array[i].ready = !array[i].ready;
      		 }
    		if( flags[array[i].ready]) continue;
    			flags[array[i].ready] = true;
    		output.push(array[i].ready);
		}
		if(output[0]===true && output.length==1){
			Meteor.call('toggleReadyOrder', this.currOrderId(id)[0]);
		}


		this.setState({'update_now':'yes'});
	}

  	togglePopup() {
   		this.setState({
      		showPopup: !this.state.showPopup
   		});
	}

	componentWillUnmount() {
		this.state.subscription.mycollections.stop();
		this.state.subscription.currOrders.stop();
	}	

	mycollections() {
		return Mcollections.find().fetch();
	}

	componentWillUnmount() {
		this.state.subscription.currOrders.stop();
		LocalOrder.clear();
		Session.set('table_number','');
		Session.set('total',0);
	}

	currOrderId(id){
		return currOrder.find({_id:id}).fetch();
	}

	currOrders() {
		return currOrder.find().fetch();
	}

	render() {

		var distinctEntries = _.uniq(currOrder.find({completed : false}, 
			{sort: {table_number: 1}, fields: {table_number: true}
			}).fetch().map(function(x) {
   			 return x.table_number;
			}), true);	
		
		return (
			<div className="resolutions">
				<nav className="snip1491">
					<li ><a href="/mymenu">My Menu</a></li>
					<li className="current"><a href="/prepareorders">Prepare Orders</a></li>				
				</nav>
				<h2>Pending Orders</h2>
				<ReactCSSTransitionGroup
					component="div"
					transitionName="route"
					transitionEnterTimeout={600}
					transitionAppearTimeout={600}
					transitionLeaveTimeout={400}
					transitionAppear={true}>
					{this.currOrders().map( (resolution)=>{
							return <ReadyOrderSingle 
							key={resolution._id} 
							resolution={resolution} 
							ready="false"
							callback={this.updateNow} />
					})}				   
				</ReactCSSTransitionGroup>
				<h2>Ready Orders</h2>
				<ReactCSSTransitionGroup
					component="div"
					transitionName="route"
					transitionEnterTimeout={600}
					transitionAppearTimeout={600}
					transitionLeaveTimeout={400}
					transitionAppear={true}>
					{this.currOrders().map( (resolution)=>{
						return <ReadyOrderSingle 
						key={resolution._id} 
						resolution={resolution} 
						ready="true"
						callback={this.updateNow} />
					})}				   
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}