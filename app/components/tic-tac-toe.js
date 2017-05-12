import Ember from 'ember';

export default Ember.Component.extend({

	ROW_COL_DIMENSION: 3,
	connection: null,
	connectivity: false,
	name: '',
	wait: false,
	latest: null,

	init() {
		this._super(...arguments);

		let connection = new WebSocket('ws://127.0.0.1:1337');

		connection.onopen = this._onConnectionOpen.bind(this);
	    connection.onerror = this._onConnectionError.bind(this);
	    connection.onmessage = this._onMessage.bind(this);

	    setInterval(function() {
	        if (connection.readyState !== 1) {
	            console.info('Unable to comminucate ' + 'with the WebSocket server.');
	        }
    	}, 3000);

    	this.set('connection', connection);
	},

	map: Ember.computed(function() {
		return this._createMap(this.get('ROW_COL_DIMENSION'));
	}),

	_createMap(dimension) {
		const arr = Ember.A(new Array(dimension));

		for(var i = 0; i < arr.length; i++) {
			arr[i] = Ember.A(new Array(dimension));

			for(var j = 0; j < arr[i].length; j++) {
				arr[i][j] = { coords: i + ',' + j }
			}
		}
		
		return arr;
	},

	mapObs: function() {
		const map = this.get('map');
		const dimension = this.get('ROW_COL_DIMENSION');
		const latest = this.get('latest');

		if(latest) {
			const latestCoords = latest.coords.split(',');

			let matched;
			let draw;

			if(!matched) {
				matched = true;
				for(let i = 0; i < dimension; i++) {
					matched = map[+latestCoords[0]][i].symbol == latest.symbol;
					if(!matched) break;
				}
			}
		
			if(!matched) {
				matched = true;
				for(let i = 0; i < dimension; i++) {
					matched = map[i][+latestCoords[1]].symbol === latest.symbol;
					if(!matched) break;
				}
			}

			if(!matched) {
				matched = true;
				for(let i = 0; i < dimension; i++) {
					matched = map[i][i].symbol === latest.symbol;
					if(!matched) break;
				}
			}

			if(!matched) {
				matched = true;
				for(let i = 0; i < dimension; i++) {
					matched = map[i][dimension - i - 1].symbol === latest.symbol;
					if(!matched) break;
				}
			}

			if(matched) {
				if(latest.symbol === this.get('symbol')) {
					this.set('message', 'Winner');
				} else {
					this.set('message', 'Try Again');
				}
				
			} else {
				draw = true;
				for(let i = 0; i < dimension; i++) {
					for(let j = 0; j < dimension; j++) {
						draw = map[i][j].symbol ? true: false;
						if(!draw) break;
					}
				}

				if(draw) {
					this.set('message', 'Draw');
				}
			}
		}
	}.observes('map').on('init'),

	reset() {
		this.set('map', this._createMap(this.get('ROW_COL_DIMENSION')));
		this.set('wait', false);
		this.set('latest', null);
		this.set('message', null);
	},

	_onMessage(message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked.
       	try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.error('Invalid JSON: ', message.data);
            return;
        }

        if (json.type === 'symbol') { // entire message history
        
        	this.set('symbol', json.data);
        
        } else if (json.type === 'message') { // it's a single message
        	
        	if(json.data.text === 'reset') {
        
        		this.reset();
        
        	} else {
        
        		const coords = json.data.text.split(',');
	            const map = this.get('map');
	            const obj = map[coords.shift()][coords.shift()];
	            
	            obj.symbol = json.data.symbol;

	            this.set('latest', obj);

	            this.set('wait', json.data.author === this.get('name'));

	            this.set('map', JSON.parse(JSON.stringify(map)));
        	}
            
        } else {
            console.log('Invalid content type: ', json);
        }
    },

	_onConnectionOpen() {
        console.debug("conection opened");
        this.set('connectivity', true);
	},

	_onConnectionError (error) {
        // just in there were some problems with conenction...
        console.error("conection error");
    },

	actions: {
		mark(coords) {
			const connectivity = this.get('connectivity');
			const wait = this.get('wait');
			
			if(connectivity && !wait) {
				this.get('connection').send(coords);
			}
		},

		play() {
			if(this.get('connectivity')) {
				this.get('connection').send(this.get('name'));
			}
		},

		reset() {
			if(this.get('connectivity')) {
				this.get('connection').send('reset');
			}
		}
	}
});
