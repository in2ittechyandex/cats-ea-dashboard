
import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';

@Injectable()
export class AppConfig {

    private config: Object = null;
    private env:    Object = null;

    constructor(private http: HttpClient) {

    }

    /**
     * Use to get the data (key) found in the second file (config file)
     *
     */
    public getConfig(key: any) {
        return this.config[key];
    }


    public environemnt() {
        return this.config;
    }

    /**
     * Use to get the data found in the first file (env file)
     */
    public getEnv(key: any) {
        return this.env[key];
    }

    /**
     * This method:
     *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
     *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
     *   These external env files can hold all the information which we were using in environment.ts , environment.prod.ts
     */
    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('./assets/ext_config/env.json').map( res => <any>res ).subscribe( (envResponse) => {
                this.env = envResponse;
                let request: any = null;
                console.log('init ' + envResponse.env);
                switch (envResponse.env) {
                    case 'production': {
                        // TODO : production related work
                        request = this.http.get('./assets/ext_config/config.' + envResponse.env + '.json');
                    }
                    break;
                    case 'development': {
                        // TODO : development related work
                        request = this.http.get('./assets/ext_config/config.' + envResponse.env + '.json');
                    }
                    break;
                    case 'uat': {
                        // TODO : uat related work
                        request = this.http.get('./assets/ext_config/config.' + envResponse.env + '.json');
                    }
                    break;
                    case 'default': {
                        console.error('Environment file is not set or invalid');
                        resolve(true);
                    } break;
                }

                if (request) {
                    request
                        .map( res => <any>res )
                        .subscribe((responseData) => {
                            this.config = responseData;
                            resolve(true);
                        });
                } else {
                    console.error('Env config file "env.json" is not valid');
                    resolve(true);
                }
            });

        });
    }
}