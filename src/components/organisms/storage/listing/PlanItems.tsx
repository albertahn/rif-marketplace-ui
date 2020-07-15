import React, { FC, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { colors } from '@rsksmart/rif-ui'
import { makeStyles, Theme } from '@material-ui/core/styles';
import EditablePlan from 'components/molecules/storage/listing/EditablePlan';
import PlanItem from 'components/molecules/storage/listing/PlanItem';
import { StoragePlan } from 'models/marketItems/StorageItem';
import { mayBePluralize } from 'utils/utils';

export interface PlanItemsProps { }

const useStyles = makeStyles((theme: Theme) => ({
  subscriptionCreator: {
    alignItems: 'center'
  },
  subscriptionCreatorPrice: {
    backgroundColor: colors.gray1,
    borderRadius: '5px'
  },
  storagePlans: {
    alignItems: 'center'
  }
}))

const PlanItems: FC<PlanItemsProps> = props => {
  const classes = useStyles()

  const [currentPlans, setCurrentPlans] = useState([] as StoragePlan[])
  const [plansCounter, setPlansCounter] = useState(0)

  const onPlanAdded = (plan: StoragePlan) => {
    const newPlan = {
      ...plan,
      _internalId: plansCounter
    }
    setPlansCounter(plansCounter + 1)
    setCurrentPlans([newPlan, ...currentPlans])
  }

  const onItemRemoved = (plan: StoragePlan) => {
    setCurrentPlans([...currentPlans.filter(x => x._internalId !== plan._internalId)])
  }

  return (
    <>
      {/* SET PLAN PRICES */}
      <Grid item xs={12}>
        <Typography color='secondary' variant='subtitle1'>SET PLAN PRICES</Typography>
        <EditablePlan onPlanAdded={onPlanAdded} />
      </Grid>
      {/* STORAGE PLANS */}
      <Grid item xs={12}>
        <Typography gutterBottom color='secondary' variant='subtitle1'>STORAGE PLANS</Typography>
        <Grid className={classes.storagePlans} container spacing={2}>
          {
            currentPlans.map((p: StoragePlan) => (
              <PlanItem
                key={p._internalId}
                monthlyDuration={mayBePluralize(p.monthsDuration, 'month')}
                rifPrice={p.pricePerGb}
                onItemRemoved={() => onItemRemoved(p)}
              />
            ))
          }
        </Grid>
      </Grid>
    </>
  )
}

export default PlanItems


