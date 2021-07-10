import React from 'react'
import { withRouter } from 'react-router-dom'

import '../../styles/initial.css'

function Initial(props) {

  const { history } = props 

  return (
    <div className="relleno">
      <div className="initial">
        
          <button
            onClick={() => history.push('/main')}
          >
            Ir a la pagina principal
          </button>

      </div>
      
    </div>
  )
}

export default withRouter(Initial);
