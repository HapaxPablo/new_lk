import { DatePicker } from '@skbkontur/react-ui/components/DatePicker'
import { Tooltip } from '@skbkontur/react-ui/components/Tooltip'
import styles from '@/app/(main)/order/OrderCreate.module.scss'
import { useOrderCreate } from '@/providers/order/OrderCreateContext'

export function DateRangePicker() {
    const { dateRange } = useOrderCreate()
    const {
        startDateValue, setStartDateValue,
        endDateValue, setEndDateValue,
        startError, endError,
        startTooltip, setStartTooltip,
        endTooltip, setEndTooltip,
        minStartDate, minEndDate,
        validateStart, unvalidateStart,
        validateEnd, unvalidateEnd,
    } = dateRange

    return (
        <div className={styles.summary__dates} suppressHydrationWarning>
            <div className="flex flex-row gap-2 items-center">
                Старт:
                <Tooltip
                    trigger={startTooltip ? 'opened' : 'closed'}
                    render={() => 'Минимум +2 дня от текущей даты'}
                    onCloseClick={() => setStartTooltip(false)}
                >
                    <DatePicker
                        error={startError}
                        value={startDateValue}
                        onValueChange={setStartDateValue}
                        onFocus={unvalidateStart}
                        onBlur={validateStart}
                        minDate={minStartDate}
                        enableTodayLink
                    />
                </Tooltip>
            </div>

            <div className="flex flex-row gap-2 items-center">
                Окончание:
                <Tooltip
                    trigger={endTooltip ? 'opened' : 'closed'}
                    render={() => 'Дата окончания должна быть минимум на 1 день позже старта'}
                    onCloseClick={() => setEndTooltip(false)}
                >
                    <DatePicker
                        error={endError}
                        value={endDateValue}
                        onValueChange={setEndDateValue}
                        onFocus={unvalidateEnd}
                        onBlur={validateEnd}
                        minDate={minEndDate}
                        enableTodayLink
                    />
                </Tooltip>
            </div>
        </div>
    )
}