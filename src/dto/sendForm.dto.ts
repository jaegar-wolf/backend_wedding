export class SendFormDto {
  name: string;
  numberOfGuest: number;
  guestList: { name: string; meal: string }[];
  willAttempt: boolean;
  meal: string;
}
