(() => {

    this.history = []
    this.current = null

    this.to = (_map, _fromBack) => {

        let map = _map || this.history[this.history.length - 1]

        // Check if the origin of call is the method back()
        let fromBack = _fromBack || null

        //Log the parameter map
        log.debug(`@param map: ${map}`)

        //If the parent is not the method back(), add the value to
        if ( !fromBack && map != this.history[this.history.length -1]) {

            //Log the result
            log.debug(`Is not in last history's index, so add: ${map}`)

            // Insert into table history
            this.history.push(map)

        }

        //Log the table history after changes
        log.debug('------------------- History is now -------------------')
        log.debug(this.history)
        log.debug('------------------------------------------------------')

        this.current = map

        //Call the mapped file
        let fullpath = `custom/services/${session.getVariable('inx_owner')}/${session.getVariable('inx_service')}/maps/${map}.js`

        log.info(`Inside ${map}.js`)

        return require (fullpath)

    }



    this.back = (_index) => {

        let index = _index || 1

        if (this.history.length == 0) return false
        

        let j = this.history.length - 1

        let limit = (this.history - 1) - index

        for (let i = j; i >= limit + 1; i--) {
            this.history.length = i
        }

        return this.to(this.history[this.history -1], true )

    }

    

    return this

})()