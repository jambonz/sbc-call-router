# sbc-call-router ![Build Status](https://github.com/jambonz/sbc-call-router/workflows/CI/badge.svg)

A simple [express-based](https://expressjs.com/) web callback for routing INVITEs to the sbc-inbound or sbc-outbound app.

INVITEs are routed based on source address: if the source address is within one of the configured CIDRs for the internal network, then it is an outbound INVITE; otherwise it is an inbound INVITE.

## Configuration

Configuration is provided via environment variables:

| variable | meaning | required?|
|----------|----------|---------|
|HTTP_PORT| tcp port to listen on for API requests|no|
|JAMBONES_NETWORK_CIDR| Network CIDR |yes|
|JAMBONES_LOGLEVEL| log level |no|
|JAMBONZ_TAGGED_INBOUND| tagged inbound |no|
|JAMBONES_INBOUND_ROUTE| inbound route url |no|
|JAMBONES_OUTBOUND_ROUTE| outbound route url |no|
|K8S| service running as kubernetes service |no|