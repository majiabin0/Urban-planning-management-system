import * as services from "@/services/type";

export default {
  namespace: "type",
  state: {
    types: null,
    typeDetail: null
  },
  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *getTypes(
      { payload: { siteId, _siteId } }: any,
      { call, put, select }: any
    ) {
      yield put({
        type: "save",
        payload: {
          types: null
        }
      });
      let types = [];
      // 尝试获取缓存
      if (window && window.sessionStorage) {
        // @ts-ignore
        const typesFromCache = window.sessionStorage.getItem(
          SESSION_TYPES + "_" + _siteId
        );
        if (typesFromCache) {
          types = JSON.parse(typesFromCache);
        }
      }
      if (types.length === 0) {
        const { data } = yield call(services.getTypes, { siteId });
        if (data.list && Array.isArray(data.list)) {
          const treeDataFormat = (
            types: any[],
            parentId: any = null
          ): any[] => {
            let res: any[] = [];
            types.forEach(type => {
              if (type.parentId == parentId) {
                res.push({
                  id: type.id,
                  parentId: type.parentId,
                  name: type.name,
                  source: type,
                  children: treeDataFormat(types, type.id)
                });
              }
            });
            return res;
          };
          types = treeDataFormat(data.list);
          if (window && window.sessionStorage) {
            // @ts-ignore
            window.sessionStorage.setItem(
              SESSION_TYPES + "_" + _siteId,
              JSON.stringify(types)
            );
          }
        }
      }
      yield put({
        type: "save",
        payload: { types }
      });
    },

    *getDetail({ payload: { id } }: any, { call, put, select }: any) {
      const { data } = yield call(services.getDetail, { id });
      yield put({
        type: "save",
        payload: {
          typeDetail: data.articleType
        }
      });
    }
  },
  subscriptions: {}
};
