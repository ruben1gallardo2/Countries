import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

function Main() {

  const api = "http://localhost:3001/api/countries"

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCountries = async () => {
      let countries = null
      try {
        countries = await fetch(api)
        countries = countries.json()
        dispatch({type:"GET_ALL_COUNTRIES", payload: countries})
      } catch (e) {
        console.log(e)
      }
      console.log(countries) 
    }
    fetchCountries();
  },[])
  return (
    <div>
      
    </div>
  )
}

export default Main
