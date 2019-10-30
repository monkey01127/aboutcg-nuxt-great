import request from '~/plugins/request';
export async function getMultiUser(data) {
    return await request({
        url: '/v1/get_multi_user',
        method: 'get',
        params: data
    });
}
