import { ToRefs, Ref } from "vue";
import { Colors } from "../UI/common";

export function useSelect(props: ToRefs<Readonly<IProps>>) {

  const selectRadius = (F: boolean) => {
    let res = {};
    res = F ? {
      width: (props.progressDisplay.value === 'horizontal' ? props.progressWidth.value * 1.1 : props.progressOutWidth.value) + 'px',
      height: (props.progressDisplay.value === 'horizontal' ? props.progressOutWidth.value : props.progressWidth.value * 1.1) + 'px',
      backgroundColor: props.progressOutBgColor.value
    } : res = {
      width: (props.progressDisplay.value === 'horizontal' ? props.progressWidth.value : props.progressHeight.value) + 'px',
      height: (props.progressDisplay.value === 'horizontal' ? props.progressHeight.value : props.progressWidth.value) + 'px',
    }
    return res;
  }

  const selectPosition = (display: "horizontal" | "vertical") => {
    if (display === "horizontal") {
      return {
        top: (-(props.progressRadioSize.value - props.progressHeight.value) / 2) + 'px',
        right: (- props.progressRadioSize.value) / 2 + 'px',
      }
    } else return {
      left: (-(props.progressRadioSize.value - props.progressHeight.value) / 2) + 'px',
      top: (- props.progressRadioSize.value) / 2 + 'px',
    }
  }

  const selectType = (T: "primary" | "danger" | "warn" | "info" | "success") => {
    switch (T) {
      case "danger": {
        return Colors.Danger;
      }
      case "info": {
        return Colors.Info;
      }
      case "primary": {
        return Colors.Primary;
      }
      case "warn": {
        return Colors.Warning;
      }
      case "success": {
        return Colors.Success;
      }
    }
  }

  const selectMark = (display: "horizontal" | "vertical", index: number) => {
    if (display === "horizontal") {
      return {
        top: 1.2 * props.progressRadioSize.value + 'px',
        left: `calc(${index}% - ${props.progressRadioSize.value / 2}px)` ,
      }
    } else {
      return {
        bottom: `calc(${index}% - ${props.progressRadioSize.value / 2}px)`,
        left:  1.2 * props.progressRadioSize.value + 'px',
      }
    }
  }

  return {
    selectRadius,
    selectPosition,
    selectType,
    selectMark
  }
}

export function useKeydown(progressWidth: Ref<number>, CustProgressWidth: Ref<number>, progressStep: Ref<number | undefined> | undefined) {

  const ProgressKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.code === "ArrowUp" || e.code === "ArrowRight") {
      if (progressStep && progressStep.value ) {
        if (CustProgressWidth.value + progressStep.value * (progressWidth.value / 100) <= progressWidth.value)
          CustProgressWidth.value += progressStep.value * (progressWidth.value / 100);
      } else {
        if (CustProgressWidth.value + 1 * (progressWidth.value / 100) <= progressWidth.value)
          CustProgressWidth.value += 1 * (progressWidth.value / 100);
        if (CustProgressWidth.value % 2 === 1)
          CustProgressWidth.value++;
      }
    } else if (e.code === "ArrowDown" || e.code === "ArrowLeft") {
      if (progressStep && progressStep.value) {
        if (CustProgressWidth.value - progressStep.value * (progressWidth.value / 100) >= 0)
          CustProgressWidth.value -= progressStep.value * (progressWidth.value / 100);
      } else {
        if (CustProgressWidth.value - 1 * (progressWidth.value / 100) >= 0)
          CustProgressWidth.value -= 1 * (progressWidth.value / 100);
        if (CustProgressWidth.value % 2 === 1)
          CustProgressWidth.value++;
      }
    }
  }

  return {
    ProgressKeyDown
  }
}