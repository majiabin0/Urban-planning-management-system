import * as services from "@/services/auth";

export default {
  namespace: "auth",
  state: {
    captcha: ""
  },
  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *getCaptcha({ payload: params }: any, { call, put, select }: any) {
      // const { captcha } = yield select((state:any) => state.login)
      yield put({
        type: "save",
        payload: {
          captcha: ""
        }
      });
      const { data } = yield call(services.getCaptcha);
      if (data.captcha) {
        yield put({
          type: "save",
          payload: {
            captcha: data.captcha
          }
        });
      } else {
        yield put({
          type: "save",
          payload: {
            captcha:
              "data:image/png;base64,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"
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }: any) {
      return history.listen(({ pathname }: any) => {
        if (pathname === "/login") {
          dispatch({
            type: "getCaptcha"
          });
        }
      });
    }
  }
};
