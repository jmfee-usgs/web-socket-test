
BroadcastServer.js runs a persistent process that
	- accepts updates posted by an IndexerListener.js
	- runs a Web Socket Server to notify clients


IndexerListener.js
	- implements the PDL ExternalIndexerListener command line api
	- posts updates to BroadcastServer
