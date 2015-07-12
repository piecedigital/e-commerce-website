var teams = ["foo", "bar", "baz", "fizz", "buzz", "biz"];
var bracket = [
	{

	},
	{

	},
	{

	}
];

var round = 0;

console.log(bracket);

function parseTeams() {
	for(var i = 0, j = 0; i < teams.length; i++, j+= 0.5) {
		if( bracket[round]["vs" + Math.floor(j)] ) {
			bracket[round]["vs" + Math.floor(j)].push(teams[i]);
			console.log("true");
		} else {
			bracket[round]["vs" + Math.floor(j)] = [teams[i]];
			console.log("false");
		}
	}
	console.log(bracket);
	eliminateTeams(2);
}
parseTeams(round);

function eliminateTeams(times) {
	if(times) {
		if(teams.length > 1){
			var spliceIndex = Math.round(Math.random() * (teams.length - 1) );
			console.log("splicing " + teams[spliceIndex]);
			teams.splice(spliceIndex, 1);
			eliminateTeams(times - 1);
		} else {
			console.log("And the winner is: " + teams[0] + "!");
		}
	} else {
		round++;
		parseTeams(round);
	}
}