	
var casper = require('casper').create();//creation d'une instance de l'objet casper.
var nbMiseAJour;//variable permettant de stocker le nombre de page que le crawler devra analysé.
var x = require('casper').selectXPath;//permet d'utiliser le Xpath.
const info = require('./config');

/* Identifiants des différents éléments dont nous aurons besoins */

var identifiant = {input_idt:'input[name="j_username"]',input_password:'input[name="j_password"]',valider_connexion:'#logOnFormSubmit'};

/* L'url de la page que l'on veut ouvrir */
casper.start("https://apps.support.sap.com/sap(bD1mciZjPTAwMQ==)/support/pam/pam.html?smpsrv=https%3a%2f%2fwebsmp104.sap-ag.de#ts=0");
//Connection sur le site SAP 
casper.then(function() {
	this.echo("page de connexion chargé");// on affiche un message
	if(casper.exists('#LOGON_BUTTON'))//Permet de contrer la redirection qui peut empêcher le crawler de continuer
	{
		casper.clickLabel("Suite");//On clique sur le boutton qui a le label suite.
		
	}
});
//On attend que le texte SAP Support Launchpad soit chargé.
casper.waitForText('SAP Support Launchpad',function(){
		this.sendKeys(identifiant.input_idt,info.idt);//on insère la valeur de info.idt dans la case ayant comment identifiant la valeur de identifiant.input_idt
		this.sendKeys(identifiant.input_password,info.pwd);//on insère la valeur de info.pwd dans la case ayant comment identifiant la valeur de identifiant.input_password
		casper.thenClick(identifiant.valider_connexion,function(){// on cliquer sur le bouton ayant comme identifiant la valeur de identifiant.valider_connexion
			casper.waitForText('Display All Product Versions',function(){// on attend que le texte Display All Product Versions apparaisse
				this.echo("connection etablie");
			});	
		});
	
	
});
casper.then(function()
{
	casper.click(x('//*[@id="pamHeaderNavigation"]/div/ul[2]/li/a'));// on click sur le boutton ayant comme Xpath celui passé en paramètre
	casper.capture("capture/cliquer_sur_ Display_All_Product_Versions.png");// On prend une photo pour voir si il a bien cliqué sur le bouton
	// On attend 10 seconde que la page soit chargé.
	casper.wait(10000,function()
	{
		
		this.echo("je clique sur le boutton Display_All_Product_Versions");
		//On récupère dans la page le nombre de fichier csv à récupérer.
		nbMiseAJour = this.evaluate(function() {
			var selector = document.getElementById('searchResultTitle');
				return selector.textContent;
		});
		nbMiseAJour=nbMiseAJour.replace('Results','');
		this.echo("Voici le nombre de fichiers csv que je vais devoir crawler: "+nbMiseAJour);
	});
	
});

casper.then(function()
{
	nbMiseAJour = Number(nbMiseAJour);// On le caste en int.
	nbPageACrawler = Math.ceil(nbMiseAJour/20);//Permet de savoir le nombre de page total à crawler.
	this.echo("Voici le nombre de pages à évaluer: "+nbPageACrawler);
	var cpt = 1// compteur permettant de crawler chacune des pages. 
	while( cpt <= nbPageACrawler )//tant que je n'ai pas atteind le nombre de page à crawler.
	{
		if ( cpt == nbPageACrawler )//Si je suis arrivé à la dernière page à crawler.
		{
			var max = nbMiseAJour %(cpt-1);//Je détermine le nombre de liens qu'il y a sur la dernière page
			for ( var i = 1;i <= max; i ++)
			{
				CliquerSurUnLien(i);//j'appelle la fonction CliquerSurUnLien()
				
			}
		}
		else //je ne suis pas à la dernière page
		{
			for ( var i = 1;i <= 20; i ++)// chaque page est composée de 20 liens.
			{
				CliquerSurUnLien(i);//j'appelle la fonction CliquerSurUnLien().
				
			}
			ChangementDePage(cpt);//j'appelle la fonctionChangementDePage().
		}
		
		cpt ++;// j'incrémente le compteur.
	}
	
	
});
// Fonction permettant de cliquer sur un lien.
function CliquerSurUnLien( i )
{	
		casper.then(function()
		{
			casper.click(x('//*[@id="SearchresultListCP"]/p['+i+']/span[1]/span[1]'));//je clique sur le lein correspondant à cette xpath.
			casper.waitForText('Technical Release Information',function()//J'attend que le texte Technical Release Information soit chargé.
			{
				this.echo("Je clique sur le lien n°"+i );
				CliqueTechnicalReleaseInformation();//j'appelle la fonction CliqueTechnicalReleaseInformation();
			},
			function fail() {
				// Si il n'y à pas de boutton Technical Release Information.
				casper.echo("je ne peux pas cliquer sur le bouton Technical Release Information");		
			});
		});
		
}

// Fonction permettant de cliquer sur le boutton CliqueTechnicalReleaseInformation.
function CliqueTechnicalReleaseInformation()
{
	casper.then(function()
	{
		casper.clickLabel("Technical Release Information");// je clique sur le boutton ayant comme label Technical Release Information
		//J 'attend que le texte Database Platforms soit chargé.
		casper.waitForText('Database Platforms',function()
		{
					
			this.echo("je clique sur le bouton Technical Release Information");
			CliqueDatabasePlatforms();//j'appelle la fonction CliqueDatabasePlatforms().
		},
		function fail() {
				// Si il n'y à pas de boutton Database Platforms .
				casper.echo("je ne peux pas cliquer sur le bouton Database Platforms");		
		});
	});
}

// Fonction permettant de cliquer sur le boutton DatabasePlatforms
function CliqueDatabasePlatforms()
{
	casper.then(function()
	{	
		casper.clickLabel("Database Platforms");//je clique sur le boutton ayant comme label Database Platforms 	
		casper.wait(10000,function()
		{
					
			this.echo("je clique sur le boutton Database Platforms");
			ExportCSV();//j'appelle la fonction ExportCSV().
		});
		
	});
}
function ExportCSV()
{
	//J'attend que le selecteur #techReleaseInfoCSVExportButtonPLTFRM soit chargé.
	casper.waitForSelector('#techReleaseInfoCSVExportButtonPLTFRM',function()
	{
		// Je récupère le href du boutton ayant comme selecteur #techReleaseInfoCSVExportButtonPLTFRM
		 var url = this.evaluate(function() {
			var selector = document.getElementById('techReleaseInfoCSVExportButtonPLTFRM');
				return selector.getAttribute('href');
		});
		
		// Je récupère le nom du logicel correspondant au fichier csv.
		var nomFichier = this.evaluate(function() {
			var selector = document.getElementById('PvInfoDialog_title');
				return selector.innerHTML;
		});
		this.echo("je clique sur le boutton Export as CSV");
		//Je télécharge le fichier csv.
		this.download(url,'MiseAJours/'+nomFichier+'.csv','GET');
		
		RevenirEnArriere();//J'appelle la fonction RevenirEnArriere();
	})
	
}
function RevenirEnArriere()
{
	casper.then(function()
	{
		//Je clique sur le boutton correspondant au xpath ci-dessous.
		this.click(x('//*[@id="PvInfoDialog"]/div[1]/span[2]'));
		//J'attend  5 secondes pour que la page ce recharge. 
		casper.wait(5000,function()
		{
				this.echo("je clique sur la croix ");
		});
	});
}
function ChangementDePage( i )
{	
		casper.then(function()
		{
			if ( i == 1)// Si j'étais sur la permière page 
			{
				//Je clique sur le boutton ayant l' Xpath ci-dessous.
				casper.click(x('//*[@id="SearchResultListNavigation"]/div[1]/span[5]'));
			}
			else
			{
				//Je clique sur le boutton ayant l' Xpath ci-dessous.
				casper.click(x('//*[@id="SearchResultListNavigation"]/div[1]/span[8]'));
				
			}
			
			//J'attend 10 seconde que la prochaine page se soit chargée.	
			casper.wait(10000,function()
			{
				
				this.echo("Je passe à la page n° "+(i+1));
			});
		});
}


casper.run();//Je lance le crawler.
