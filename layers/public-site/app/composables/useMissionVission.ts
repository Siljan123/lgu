export interface CoreValue{
    description:string
}

export interface Content {
  mission: string
  vision: string
  core: CoreValue []
}

export const useContent = ():Content =>{
        return{
            mission:'Deliver effective, efficient and quality services to the constituents and optimize utilization of its natural resources with consideration to ecological effects.',
            vision:'  The Commercial and Educational Center of Agusan del Sur with God-loving, Healthy and Disaster Resilient community living in a Safe and Sustained Natural Environment with a Storing Local Economy under a Well Planned Infrastructure governed by a Dynamic and Transparent Leadership.',
            core:[
                {
                    description:'Respect for Human Worth and Dignity; Unity;'
                },
                {
                    description:'Trustworthiness and Accountability'
                },
                {
                    description:"Passion and Commitment for People's Development; and Concern for Environment Conservation and Protection"
                }

            ]
        }
}