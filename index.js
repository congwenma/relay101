let React    = require('react');
let ReactDOM = require('react-dom');
let Relay = require('react-relay');

class Item extends React.Component {
	render() {
		let item = this.props.store.item;

		return (
			<div>
				<h1><a href={item.url}>{item.title}</a></h1>
				<h2>{item.score} - {item.by.id}</h2>
				<hr />
			</div>
		);
	}
};

// wrapping in higher-order component
// - redefine my Item component as a new component which wraps the original in a container
// For the component's `store` prop, I need the data described in this GraphQL fragment

// I know I need it on a "HackerNewsAPI" object because I explored the API
// via http://GraphQLHub.com/playground/hn.

// fragment are analogous to alias/symlinks in a query, and are NOT the final query for how to fetch all the data.
Item = Relay.createContainer(Item, {
	fragments: {
		store: () => Relay.QL`
			fragment on HackerNewsAPI {
				item(id: 8863) {
					title,
					score,
					url
					by {
						id
					}
				}
			}
		`
	}
})

// We do need a finalized `GraphQL` query, which is where Relay Route get used, it is a 'root query'?? which bootstraps our data requests
class HackerNewsRoute extends Relay.Route {
	static routeName = 'HackerNewsRoute'
	static queries = {
		store: ((Component) => {
			return Relay.QL`
				query root {
					hn { ${Component.getFragment('store')} },
				}
			`
		})
	}
}

Relay.injectNetworkLayer(
	new Relay.DefaultNetworkLayer('https://www.GraphQLHub.com/graphql')
)

let mountNode = document.getElementById('container');

let rootComponent = <Relay.RootContainer
	Component={Item}
	route={new HackerNewsRoute()}
/>

ReactDOM.render(rootComponent, mountNode);
