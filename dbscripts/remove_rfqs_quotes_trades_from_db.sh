#!/bin/bash

mongo $MONGOLAB_DEV_URI -u $DB_CONSOLE_USER -p $DB_CONSOLE_PASSWORD --eval 'db.trades.drop(); db.rfqs.drop(); db.quotes.drop();'