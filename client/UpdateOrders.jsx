import React, {Component} from 'react';
import ResolutionForms from './resolutions/ResolutionForms.jsx';
import ResolutionSingle from './resolutions/ResolutionSingle.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import NewEntry from './resolutions/NewEntry.jsx';
import OrderResolution from './resolutions/OrderResolution.jsx';

export default class UpdateOrders extends TrackerReact(React.Component) {
	constructor(){
		super();

		this.state = {
			subscription:{
				mycollections: Meteor.subscribe("allResolutions"),
				currOrders: Meteor.subscribe("allOrders"),
				findshops: Meteor.subscribe("allshops"),
				showPopup: false
			}
		}		
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
	findshops(shop){
		return Shop.find({"shop": shop}).fetch();
	}

	currOrders() {
		return currOrder.find().fetch();
	}

	render() {

		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		let orders=<h2>Loading...</h2>;
		if(obj[0]){
			var pos=obj[0].profile.position;
			var shop=this.findshops(obj[0].profile.shop);
			if(shop[0]){
				var distinctEntries = _.uniq(currOrder.find({
					$or: [ {paid : false}, {status : false} ]}, 
					{sort: {table_number: 1}, fields: {table_number: true}
					}).fetch().map(function(x) {
		   			 return x.table_number;
					}), true);	

				var tables_numbers=[];
				for (let i = 1; i <= shop[0].tables; ++i) {
					if(distinctEntries.includes(i)){
						tables_numbers[i]={ value:i, label: i };
					}else{}	 
				}
				if(pos==="manager" || pos==="waiter"){
					orders=<div>
						<ReactCSSTransitionGroup
						component="div"
						transitionName="route"
						transitionEnterTimeout={600}
						transitionAppearTimeout={600}
						transitionLeaveTimeout={400}
						transitionAppear={true}>
	       				<OrderResolution 
	       					nav_option="update"
	       					table_numbers={tables_numbers}/>					   
					</ReactCSSTransitionGroup>
					</div>
				}else{
	  				orders=<h2> Sorry you have no rights to update orders</h2>
	  			}
			}
		}
		
		return (
			<div className="resolutions">
  			<nav className="snip1490">
				<li><a href="/orders">New</a></li>
				<li className="current"><a href="/update_orders">Update</a></li>
				<li><a href="/deliver_orders">Deliver</a></li>
				<li><a href="/pay_orders">Pay</a></li>
				<li><a href="/completed_orders">completed</a></li>
			</nav>	
			{orders}
			</div>
		)
	}
}