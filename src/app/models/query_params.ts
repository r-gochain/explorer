import {BehaviorSubject, Subject} from 'rxjs';

interface IParams {
  limit: number;
  skip: number;
}

export class QueryParams {
  private _limit: number;
  get limit(): number {
    return this._limit;
  }

  set limit(value: number) {
    this._limit = value;
    this.calculateTotalPage();
    this.toStart();
  }

  skip: number;
  page = 1;
  page$: BehaviorSubject<number> = new BehaviorSubject(1);
  total: number;
  totalPage: number;
  totalPage$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  currentTotal: number;
  state: Subject<IParams> = new Subject<IParams>();

  constructor(limit?: number) {
    this._limit = limit || 25;
    this.skip = 0;
    this.currentTotal = this._limit;
  }

  setTotalPage(total: number) {
    this.total = total;
    this.calculateTotalPage();
  }

  calculateTotalPage() {
    this.totalPage = Math.ceil(this.total / this._limit);
    this.totalPage$.next(this.totalPage);
  }

  init() {
    this.state.next(this.params);
  }

  next() {
    this.page++;
    this.skip += this._limit;
    this.currentTotal = this.page * this._limit;
    this.state.next(this.params);
  }

  previous() {
    this.page--;
    this.skip -= this._limit;
    this.state.next(this.params);
  }

  toPage(page: number) {
    this.page = page;
    this.page$.next(this.page);
    this.skip = (this.page - 1) * this._limit;
    this.state.next(this.params);
  }

  toStart() {
    this.page = 1;
    this.skip = 0;
    this.state.next(this.params);
  }

  toEnd() {
    this.page = this.totalPage;
    this.skip = (this.page - 1) * this._limit;
    this.state.next(this.params);
  }

  get params(): IParams {
    return {limit: this._limit, skip: this.skip};
  }
}
