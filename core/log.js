(() => {

    const alert    = (message, artifact) => wrapper('ALERT',    message, artifact)
    const consoleL = (message, artifact) => wrapper('CONSOLE',  message, artifact)
    const crit     = (message, artifact) => wrapper('CRITICAL', message, artifact)
    const debug    = (message, artifact) => wrapper('CONSOLE',  message, artifact)
    const err      = (message, artifact) => wrapper('ERR',      message, artifact)
    const info     = (message, artifact) => wrapper('INFO',     message, artifact)
    const notice   = (message, artifact) => wrapper('NOTICE',   message, artifact)
    const warn     = (message, artifact) => wrapper('WARNING',  message, artifact)

    const wrapper = (level, message, artifact) => {

        level    = level || 'CONSOLE'
        message  = null !== session ? `${ session.uuid }\t${ getByType( message ) }` : getByType( message )
        artifact = null !== artifact ? artifact : null

        if ( typeof artifact !== 'undefined' ) message += ` => ${ getByType( artifact ) }`

        return console_log( level, message )

    }

    const getByType = message => {

        switch ( typeof message ) {
            case 'undefined':
                return `undefined`
            case 'object':
                return `[Object] ${ JSON.stringify( message, null, 4 ) }`
            case 'function':
                return `[Function] ${ JSON.stringify( message, null, 4 ) }`
            case 'number':
                return `[Number] ${ message.toString() }`
            case 'boolean':
                return `[Boolean] ${ message.toString() }`
            default:
                return message.toString()
        }

    }

    const welcome = () => {
        info( '|------------------- | INCOMING CALL | ----------------------|'            )
        info( '| owner:              ' + session.getVariable('inx_owner').toUpperCase()   )
        info( '| service             ' + session.getVariable('inx_service').toUpperCase() )
        info( '| uuid:               ' + session.uuid                                     )
        info( '| channel_name:       ' + session.getVariable( 'channel_name' )            )
        info( '| caller_id_name:     ' + session.getVariable( 'caller_id_name' )          )
        info( '| caller_id_number:   ' + session.getVariable( 'caller_id_number' )        )
        info( '| destination_number: ' + session.getVariable( 'destination_number' )      )
        info( '|------------------------------------------------------------|'            )
        info( '' )
    }

    return {
        alert:   alert,
        console: consoleL,
        crit:    crit,
        debug:   debug,
        err:     err,
        error:   err,
        info:    info,
        notice:  notice,
        warn:    warn,
        warning: warn,
        welcome: welcome
    }

})()