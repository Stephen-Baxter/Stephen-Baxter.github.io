class JQTBrain
{
	#numberOfStates = 0;
	#numberOfActions = 0;
	#qTable = [];

	#BuildQTable = function()
	{
		this.#qTable = [];
		for(let i = 0; i < this.#numberOfStates; i++)
		{
			let j = [];
			for (let k = 0; k < this.#numberOfActions; k++) j.push(0);
			this.#qTable.push(j);
		}
	}

	constructor(number_of_states_, number_of_actions_, alpha_, gamma_, q_table_ = [])
	{
		this.#numberOfStates = number_of_states_, this.#numberOfActions = number_of_actions_, this.#qTable = q_table_, this.alpha = alpha_, this.gamma = gamma_;
		if (!q_table_.length) this.#BuildQTable();
	}

	GetAction = function(state_, chooses_random_action_ = false)
	{
		if(chooses_random_action_) return Math.floor(Math.random() * this.#numberOfActions);
		else
		{
			let highestQTableValueForState = Math.max.apply(null, this.#qTable[state_]);
			for (let i = 0; i < this.#numberOfActions; i++) if(this.#qTable[state_][i] == highestQTableValueForState) return i;
		}
	}
	
	UpdateQTable = function (reward_1_, state_0_, action_0_, state_1_)
	{
		this.#qTable[state_0_][action_0_] = this.#qTable[state_0_][action_0_] + this.alpha * (reward_1_ + this.gamma * Math.max.apply(null, this.#qTable[state_1_]) - this.#qTable[state_0_][action_0_]);
	}
	ResetQTable = function(alpha_ = this.alpha, gamma_ = this.gamma)
	{
		this.#qTable = [], this.alpha = alpha_, this.gamma = gamma_;
		this.#BuildQTable();
	}
	get qTable() { return this.#qTable; }
}