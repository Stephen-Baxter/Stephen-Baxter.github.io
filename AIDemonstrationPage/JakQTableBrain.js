class JQTBrain
{
	#numberOfStates = 0;
	#numberOfActions = 0;
	#qTable = [];
	#alpha = 0;
	#gamma = 0;

	#BuildQTable = function()
	{
		for(let i = 0; i < this.#numberOfStates; i++)
		{
			let j = [];
			for (let k = 0; k < this.#numberOfActions; k++) j.push(0);
			this.#qTable.push(j);
		}
	}

	constructor(number_of_states_ = 0, number_of_actions_ = 0, alpha_ = 0, gamma_ = 0, q_table_ = [])
	{
		this.#numberOfStates = number_of_states_, this.#numberOfActions = number_of_actions_, this.#qTable = q_table_;
		this.#alpha = alpha_, this.#gamma = gamma_;
		this.#BuildQTable();
	}

	GetActionNumber = function(state_ = 0, chooses_random_action_ = false)
	{
		if(chooses_random_action_) return Math.floor(Math.random() * this.#numberOfActions);
		else
		{
			let highestQTableValueForState = Math.max.apply(null, this.#qTable[state_]);
			for (let i = 0; i < this.#numberOfActions; i++) if(this.#qTable[state_][i] == highestQTableValueForState) return i;
		}
	};
	
	UpdateQTable = function (reward_1_ = 0, state_0_ = 0, action_0_ = 0, state_1_ = 0)
	{
		this.#qTable[state_0_][action_0_] = this.#qTable[state_0_][action_0_] + this.#alpha * (reward_1_ + this.#gamma * Math.max.apply(null, this.#qTable[state_1_]) - this.#qTable[state_0_][action_0_]);
	};
	ResetQTable = function()
	{
		this.#qTable = [];
		this.#BuildQTable();
	};
	GetQTable = function()
	{
		return this.#qTable;
	};

	SetAlpha = function(alpha_ = 0)
	{
		this.#alpha = alpha_;
	};
	GetAlpha = function()
	{
		return this.#alpha;
	};

	SetGamma = function(gamma_ = 0)
	{
		this.#gamma = gamma_;
	};
	GetGamma = function()
	{
		return this.#gamma;
	};
}