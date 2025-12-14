import { HttpContext } from "@angular/common/http";
import { SKIP_TOAST } from "./http-context";

export function skipToast() {
    return new HttpContext().set(SKIP_TOAST , true)
}