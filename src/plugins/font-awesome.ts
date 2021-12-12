import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUserSecret,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faCalendarAlt,
  faPortrait,
  faExclamationCircle,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWindowClose,
  faIdCard,
  faClock,
} from "@fortawesome/free-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faUserSecret,
  faChevronLeft,
  faChevronRight,
  faWindowClose,
  faTimes,
  faCalendarAlt,
  faPortrait,
  faIdCard,
  faClock,
  faExclamationCircle,
  faCaretDown
);

export default FontAwesomeIcon;
