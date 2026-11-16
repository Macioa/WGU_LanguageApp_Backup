//uses jquery, add this line to html page for all functions to work properly:
//<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
console.log('FileReader5 loaded');


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
	};

function withTags(wordList, tags){
		if (tags[0]=='all'||tags[0]==''){return wordList;}
		if (tags.length!=0){
			var matches = [];
			tag = tags.shift();
			for (n in wordList){
				for (t in wordList[n].tags){
					if (wordList[n].tags[t].toLowerCase()==tag.toLowerCase()){matches.push(wordList[n])}}}
			/*for (n in matches){console.error(matches[n]);}
			console.log("iteration complete");*/
			matches = withTags(matches, tags);
			} else {matches = wordList;}
		return matches;
	};
	
function removeArrayDuplicates(array){
	var uniqueElements = []
	$.each(array, function(i, el){if($.inArray(el, uniqueElements) === -1) uniqueElements.push(el);});
	return uniqueElements
	};
	
function createWord(word, character, definition, example, day, month, year, tags){return {"word":word, "character":character, "definition":definition, "example":example, "day":day, "month":month, "year":year, "tags":tags}}

function readDirectory(){
	directory = localStorage.getItem('directory');
	if (directory == null){directory=[]; alert('Directory not found. Please load vocabulary from file.');} else {directory = directory.split(",");}
	//if (directory.search(",")!=-1){directory = directory.split(",");}
	//alert(directory.length);
	return directory;};

function writeDirectory(directory){
	localStorage.setItem('directory',directory);
	};

var openUserFile = function(event){OpenFile(event.target); }

var openSampleFile = function(){ 
	$.ajax({
		url:'RyansVocab.csv',
		dataType: 'text',
		success: function (data){
			ParseFile(data);
			}
		})
	}
	
function ClearStorage(){ localStorage.clear(); alert("local storage cleared"); }

function ParseFile(instring){
	  var wordstrings = instring.split("\n");
	  var fullstring = "";
	  var directory = [];
	  var wordList = [];
	  var vocabarray = [];
	  for (n in wordstrings){
		var parsed = wordstrings[n].split(",");
		word = parsed.shift()
		if (word != undefined && word != ""){
			character = parsed.shift();
			definition = parsed.shift();
			example = parsed.shift();
			day = parsed.shift();
			month = parsed.shift();
			year = parsed.shift();
			tags = []
			for (n in parsed){
				parsed[n] = parsed[n].replaceAll(" ","")
				if (parsed[n]!=null){tags.push(parsed[n])}
				}
			tags.pop();
			var newWord = createWord(word, character, definition, example, day, month, year, tags);
			var jsonWord = JSON.stringify(newWord);
			//console.log("Added: "+jsonWord);
			localStorage.setItem(word, jsonWord);
			 //console.log("local storage for <"+word+">: "+localStorage.getItem(word));//check storage
			directory.push(word);
			} else {console.error("Undefined Entry: '"+word+"'")}
		};

	localStorage.setItem('directory',directory);
	if (directory.length > 0){ alert("File Loaded"); } else { alert("File Load Error")  }
	console.log(localStorage.getItem('directory'));
	}

function OpenFile(input) {
	//console.log(input.files[0]);
	var reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;
      //console.log(reader.result.substring(0, 200));
	  var instring = reader.result;
	  ParseFile(instring);
    };
    reader.readAsText(input.files[0]);
  };

function readVocab(){
	var dir = readDirectory();
	return readWordList(dir);
	};
  
function readWordList(directory){
	var newWordList = [];
	for (n in directory){
		//console.log("attempting to read item "+n.toString()+": "+directory[n]);
		newWord = localStorage.getItem(directory[n]);
		//console.log("parsing "+newWord);
		newWordList.push(JSON.parse(newWord));		
		};
	return newWordList;
	};


function addWord(word){
	var dir = readDirectory();
	if (dir.length == 0){alert("Creating new vocabulary list");}
	var wordList = readWordList(dir);
	wordList.push(word);
	directory.push(word.word);
	writeVocab(wordList);
	writeDirectory(dir);
	}
	
	
function writeVocab(wordList){
	var dir = [];
	for (n in wordList){
		localStorage.setItem(wordList[n].word, JSON.stringify(wordList[n]));
		dir.push(wordList[n].word);
		}
		dir = removeArrayDuplicates(dir)
		writeDirectory(dir);
	};
	
function CreateVocabTable(wordList){
	tbody = document.createElement('table');
	tbody.setAttribute('border','1');
	tbody.id = 'vocabTable';
	
	trh = document.createElement('tr');
	headers = ['Word','Character','Definition','Example','Date Added','Tags']
	for (n in headers){
		th = document.createElement('th');
		th.scope = 'col';
		th.appendChild(document.createTextNode(headers[n]));
		trh.appendChild(th);
		}
	tbody.appendChild(trh);

	for (n in wordList){
		var tr = document.createElement("tr");
		var tdword = document.createElement("td");
		tdword.appendChild(document.createTextNode(wordList[n].word));
		tr.appendChild(tdword);
		tr.id = 'test';
		var tddef = document.createElement("td");
		tddef.appendChild(document.createTextNode(wordList[n].character));
		tr.appendChild(tddef);
		var tddef = document.createElement("td");
		tddef.appendChild(document.createTextNode(wordList[n].definition));
		tr.appendChild(tddef);
		var tdex = document.createElement("td");
		tdex.appendChild(document.createTextNode(wordList[n].example));
		tr.appendChild(tdex);
		var tddate = document.createElement("td");
		tddate.appendChild(document.createTextNode(wordList[n].month+"/"+wordList[n].day+"/"+wordList[n].year));
		tr.appendChild(tddate);
		tbody.appendChild(tr);
		var tdta = document.createElement("td");
		tdta.appendChild(document.createTextNode(wordList[n].tags));
		tr.appendChild(tdta);
		}
	return tbody;
	};

function numbersToAccent(WordWithNumbers){
	array = []
	vowels = ['a','e','i','o','u'];
	firstTone = ['%u0101','%u0113','%u012B','%u014D','%u016B'];
	secondTone = ['%E1','%E9','%ED','%F3','%FA'];
	thirdTone = ['%u0103','%u0115','%u012D','%u014F','%u016D'];
	fourthTone = ['%E0','%E8','%EC','%F2','%F9'];
	oddTone = ['%FC'];
	array.push(firstTone, secondTone, thirdTone, fourthTone);
	for (c in array){for (n in array[c]){array[c][n]=unescape(array[c][n]); }}
	
	for (c in array){
		//console.log('c= '+c.toString());
		for (n in array[c]){
			num = parseInt(c)+1;
			WordWithNumbers = WordWithNumbers.replaceAll(vowels[n]+num.toString(),array[c][n]);
			//console.log("replacing "+array[c][n]+" with "+vowels[n]+num.toString());
			}
		}
	WordWithNumbers = WordWithNumbers.replaceAll('v4',unescape(oddTone[0]));
	return WordWithNumbers;
	}
	
function formatWord(WordWithMarks){
	array = []
	vowels = ['a','e','i','o','u'];
	firstTone = ['%u0101','%u0113','%u012B','%u014D','%u016B'];
	secondTone = ['%E1','%E9','%ED','%F3','%FA'];
	thirdTone = ['%u0103','%u0115','%u012D','%u014F','%u016D'];
	fourthTone = ['%E0','%E8','%EC','%F2','%F9'];
	oddTone = ['%FC'];
	array.push(firstTone, secondTone, thirdTone, fourthTone);
	//console.log(WordWithMarks);
	
	for (c in array){for (n in array[c]){array[c][n]=unescape(array[c][n]); }}
	
	for (c in array){
		//console.log('c= '+c.toString());
		for (n in array[c]){
			num = parseInt(c)+1;
			WordWithMarks = WordWithMarks.replaceAll(array[c][n],vowels[n]+num.toString());
			//console.log("replacing "+array[c][n]+" with "+vowels[n]+num.toString());
			}
		}
	WordWithMarks = WordWithMarks.replaceAll('ü','v4');
	WordWithMarks = WordWithMarks.replaceAll(' ','');
	return WordWithMarks;
	}
	
function CreateAudio(word){
	if (word == "correct"){		samples = ["applause_2.mp3", "applause_3.mp3", "cashregister.wav", "clap.wav", "correctamundo.mp3", "fanfare.wav", "GROOVEE2.wav", "hallelujah.wav", "kidscheer.wav", "oohhh.wav", "yes!.wav", "you-got-it-1.wav", "you-got-it-2.wav"]		}
	else if (word == "incorrect"){		samples = ["BUZZER.wav", "buzzer2.wav", "buzzerheavy.wav", "crying man.wav", "doh.mp3", "groan2.wav", "maybe-next-time-huh.wav", "no-4.wav", "no-thats-not-gonna-do-it.wav", "screamwhat.wav", "voicebuzzer.mp3"]		}
	if (word == "correct" || word == "incorrect") {
		// Reconstruction: original SoundBytes/ files were not archived; play a synthesized tone instead.
		try {
			var ctx = new (window.AudioContext || window.webkitAudioContext)();
			var osc = ctx.createOscillator(), gain = ctx.createGain();
			osc.type = (word == "correct") ? "sine" : "square";
			osc.frequency.value = (word == "correct") ? 880 : 160;
			gain.gain.value = 0.1;
			osc.connect(gain); gain.connect(ctx.destination);
			osc.start(); osc.stop(ctx.currentTime + 0.3);
		} catch (e) {}
		return document.createElement("audio");
		}
	else {	weblink = "http://www.hantrainerpro.de/resources/pronunciations/"+formatWord(word)+".mp3";	}
	audio = document.createElement("audio");
	audio.src = weblink;
	document.body.appendChild(audio);
	audio.play();
	return audio;
	}

function parseTags(inputdata){
	console.log(inputdata);
	if (inputdata.search(',')!=-1){
		tags = inputdata.replaceAll(" ","");
		tags = tags.split(",");
		}
	else {tags = inputdata.split(" ");}
	console.log(tags);
	return tags;
	}
	
//AddWord.html
function getWordFromForm(form){
	today = new Date();
	tags = parseTags(form.Tags.value);
	word = createWord(form.Word.value,form.Character.value,form.Definition.value,form.Example.value,today.getDate(),today.getMonth()+1,today.getFullYear(),tags);
	//alert(JSON.stringify(word));
	//alert(document.getElementsByName("newWord")[0].Tags);
	addWord(word)
	}
	
function GoogleTranslate(input){
	if (typeof GOOGLE_API_KEY == "undefined" || GOOGLE_API_KEY == ""){
		alert("Translate unavailable: add your key to config.js");
		return;
		}
	$.get("https://www.googleapis.com/language/translate/v2",
		{
		key:GOOGLE_API_KEY,
		source:"en",
		target:"zh",
		q:input
		},
		function(response)
		{	
			document.getElementById('char').value = response.data.translations[0].translatedText;
		},"json") .fail(function(jqXHR, textStatus, errorThrown) 
		{
			alert( "error :"+errorThrown );
		});
	}

//Review.html
function tableFromTags(event, form){
	event.preventDefault();
	$.each(document.getElementsByTagName("table"), function(i, el){el.remove()}); //remove all existing tables
	tags = parseTags(form.Tags.value);
	var dir = readDirectory();
	
	var wordList = readWordList(dir);
	main = document.getElementsByTagName("body")[0];
	table = CreateVocabTable(withTags(wordList, tags));
	table.style.margin = "auto";
	main.appendChild(table);
	}
	
//ToFile.html
function outString(){
	str = "<br><br><br>";
	seperator = ", ";
	var dir = readDirectory();
	var wordList = readWordList(dir);
	//$.each(wordList, function(i, el){console.log(el.word)});
	$.each(wordList, function(i, el){str += el.word + seperator + el.character + seperator + el.definition + seperator + el.example + seperator + el.day + seperator + el.month + seperator + el.year + seperator;
	$.each(el.tags, function(i, el){str += el + seperator});
	str += "/n<br>"
	});
	var body = document.getElementsByTagName("body")[0];
	var div = document.createElement('div');
	div.innerHTML = str;
	body.appendChild(div);
	}
	
//Quiz.html	
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }
  return array;
  }

class quizForm {
	constructor(form){this.form = form;
		$.each(form.getElementsByTagName('input'), function(i, el){el.id = el.value});
		var qb = document.getElementsByName('quizby'); this.qb = qb;
		var ab = document.getElementsByName('answerby'); this.ab = ab;
		var it = document.getElementsByName('inputtype'); this.it = it;
		for (var i = 0; i < qb.length; i++){qb[i].onclick = function(){qf.changeQuizBy()}};
		for (var i = 0; i < ab.length; i++){ab[i].onclick = function(){qf.changeAnswerBy()}};
		this.form.Master.value = 3;
		this.form.quizby.value = 'qpinyin'; this.changeQuizBy(); 
		this.form.answerby.value = 'adef'; this.changeAnswerBy();
		this.form.inputtype.value = 'multchoice';
		}

	enableAll(buttons){	$.each(buttons, function(i, el){el.disabled = false})	}

	changeQuizBy(){	
		this.enableAll(this.ab);
		switch (this.form.quizby.value){
			case 'qpinyin' :  
				if (this.form.answerby.value == 'apinyin'){this.form.answerby.value = 'achar'}
				this.form.apinyin.disabled = true; break;
			case 'qchar' :  
				if (this.form.answerby.value == 'achar'){this.form.answerby.value = 'adef'}
				this.form.achar.disabled = true; break;
			case 'qdef' :  
				if (this.form.answerby.value == 'adef'){this.form.answerby.value = 'apinyin'}
				this.form.adef.disabled = true; break;
			}
		this.changeAnswerBy();
		}

	changeAnswerBy(){
		this.enableAll(this.it);
		if (this.form.answerby.value == 'achar'){ this.form.inputtype.value = 'multchoice'; this.form.field.disabled = true }
		}

	}
	
class Quiz {
	constructor(quizForm){	this.quizForm = quizForm; this.form = quizForm.form;	}
	
	startNewQuiz(event){
		event.preventDefault();
		this.quizby = this.form.quizby.value;
		this.answerby = this.form.answerby.value;
		this.inputtype = this.form.inputtype.value;
		var dir = readDirectory();
		var wordList = readWordList(dir);
		this.wordList = withTags(wordList, parseTags(this.form.Tags.value));
		this.activeList = this.wordList.slice(0) //clone array
		this.total = this.wordList.length;
		this.neededToMaster = this.form.Master.value;
		this.count = 0;
		$.each(this.activeList, function(i, el){el.count = 0});
		
		this.setCurrentWord();
		this.addPrompt();
		}
		
	addStatusForm(){
		if (this.statusForm!=null){this.statusForm.remove()}
		this.statusForm = document.createElement('form');
		this.statusForm.id = 'status';
		this.form.parentNode.insertBefore(this.statusForm,this.form);
		this.updateStatus(this.currentWord.count);
		}
		
	updateStatus(currentWordCount){
		var string = "Current Word Progress: "+currentWordCount+"/"+this.form.Master.value+"<br>Mastered Words: "+this.count+"/"+this.total;
		this.statusForm.innerHTML = string;
		}
	
	setCurrentWord(){	var i = Math.floor((Math.random() * this.activeList.length)); this.currentWord = this.activeList[i]; }
	
	addPrompt(){
		if (this.activeForm!=null){this.activeForm.remove();};
		this.activeForm = document.createElement('form');
		var promptDiv = document.createElement('div');
		promptDiv.id = 'promptDiv';
		prompt = '';
		switch(this.quizby){
			case 'qpinyin' : prompt+=this.currentWord.word; promptDiv.style.fontSize = "x-large"; CreateAudio(this.currentWord.word);break;
			case 'qchar' : this.activeForm.appendChild(document.createElement('br')); prompt+=this.currentWord.character; promptDiv.style.fontSize = "xx-large"; break;
			case 'qdef' : prompt+=this.currentWord.definition; promptDiv.style.fontSize = "medium"; break;
			}		

		promptDiv.appendChild(document.createTextNode(prompt));
		this.activeForm.appendChild(promptDiv);
		for (var i = 0; i < 3; i++){this.activeForm.appendChild(document.createElement('br'))};
		
		switch(this.inputtype){
			case 'field' : 
				var response = document.createElement('input'); response.type = 'text'; response.name='response'; 
				this.activeForm.appendChild(response); break;
			case 'multchoice' :
				var answers = this.possibleAnswers();
				for (var i = 0; i<answers.length; i++){
					var response = document.createElement('input'); 
					response.type = 'radio'; 
					response.name = 'response';
					response.onchange = function(){submitButton.focus()};
					switch(this.answerby){
						case 'apinyin' : response.id = answers[i].word; response.value = answers[i].word; break;
						case 'achar' : response.id = answers[i].character; response.value = answers[i].character; break;
						case 'adef' : response.id = answers[i].definition; response.value=answers[i].definition; break;
						}
					this.activeForm.appendChild(response); 
					this.activeForm.appendChild(document.createTextNode(response.value)); 
					this.activeForm.appendChild(document.createElement('br'));
				}
				break;
			}
		switch(this.answerby){
			case 'apinyin' : this.answer = this.currentWord.word; break;
			case 'achar' : this.answer = this.currentWord.character; break;
			case 'adef' : this.answer = this.currentWord.definition; break;
			}
		this.activeForm.appendChild(document.createElement('br'));
		var submitButton = document.createElement('input'); submitButton.type = 'submit'; submitButton.value = 'submit'; submitButton.name = 'submitActive';	submitButton.id = 'submitActive'; 
		submitButton.onclick = function(){q.evaluateResponse();}
		this.activeForm.appendChild(submitButton); 

		
		
		this.addStatusForm()
		this.form.parentNode.insertBefore(this.activeForm,this.form);
		response.focus();
		//submitButton.focus();
		//alert(document.activeElement.id);
		}
		
	possibleAnswers(){
		var choices = []; choices.push(this.currentWord);
		for (var i = 0; i<3; i++){choices.push(this.wordList[Math.floor((Math.random() * this.wordList.length))])}
		return shuffle(choices);
		}
		
	evaluateResponse(){
		/*alert(this.activeForm.response.value);
		alert(this.answer);
		alert(this.activeForm.response.value.search(this.answer));
		alert(this.answer.search(this.activeForm.response.value));*/
		correct = false;
		if (this.activeForm.response.value.length>0){
			if ( (this.activeForm.response.value.search(this.answer)!=-1) || (this.answer.search(this.activeForm.response.value)!=-1) ){var correct = true} else {var correct = false}
			}
		if (correct){this.currentWord.count += 1} else {this.currentWord.count = 0}
		if (this.currentWord.count >= this.neededToMaster) {
			this.count += 1; 
			this.activeList.splice(this.activeList.indexOf(this.currentWord), 1)
			}

		if (correct){this.activeForm.innerHTML="Correct!<br>"; this.activeForm.appendChild(this.getImage(true)); CreateAudio('correct'); var timeout = 3000}
			else{this.activeForm.innerHTML="Incorrect.<br>"; this.activeForm.appendChild(this.getImage(false)); CreateAudio('incorrect'); var timeout = 10000}	
		
		if (!correct){ 
			setTimeout(function(){q.activeForm.innerHTML = ""; addWordPage(q.activeForm, q.currentWord)}, 2000);
			}
		setTimeout(function(){q.nextPrompt()}, timeout);
		
		}
		
	nextPrompt(){
		if (this.activeList.length == 0) {this.statusForm.innerHTML = "Complete!"; this.activeForm.remove()}
		else {this.setCurrentWord();		this.addPrompt();}
		}
		
	getImage(correct){
		var image = document.createElement("IMG");
		if (correct){var src = "correct.png"; var alt = "The answer was correct!";} else {var src = "incorrect.png"; var alt = "The answer was incorrect.";}
		image.src = src; image.alt = alt;
		return image;
		}
	}

function addWordPage(form, word){
	CreateAudio(word.word);
	
	charprint = document.createElement('div');
	charprint.style.fontSize = '700%';
	charprint.appendChild(document.createTextNode(word.character));
	
	pinyinprint = document.createElement('div');
	pinyinprint.style.fontSize = '300%';
	pinyinprint.appendChild(document.createTextNode(word.word));
	
	defprint = document.createElement('div');
	defprint.style.fontSize = '150%';
	defprint.appendChild(document.createTextNode(word.definition));
	
	exampleprint = document.createElement('div');
	exampleprint.style.fontSize = '120%';
	exampleprint.style.color = 'DimGrey';
	exampleprint.appendChild(document.createTextNode(word.example));
	
	tagprint = document.createElement('div');
	tagprint.style.fontsize = '10%';
	tagprint.style.color = 'DarkGrey';
	$.each(word.tags, function(i, el){ tagprint.appendChild(document.createTextNode(el + ", ")) })
	
	form.appendChild(charprint);
	form.appendChild(pinyinprint);
	form.appendChild(document.createElement('br'));
	form.appendChild(document.createTextNode('-------------------------'));
	form.appendChild(document.createElement('br'));
	form.appendChild(defprint);
	form.appendChild(document.createElement('br'));
	form.appendChild(exampleprint);
	form.appendChild(document.createElement('br'));
	form.appendChild(tagprint);
	}
	
		