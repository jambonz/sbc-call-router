# sbc-call-router ![Build Status](https://github.com/jambonz/sbc-call-router/workflows/CI/badge.svg)

A simple [express-based](https://expressjs.com/) web callback for routing INVITEs to the sbc-inbound or sbc-outbound app.

INVITEs are routed based on source address: if the source address is within one of the configured CIDRs for the internal network, then it is an outbound INVITE; otherwise it is an inbound INVITE.

## Installation
* copy `config/default.json.example` to `config/local.json`
* edit as appropriate for your need
* `npm start`.