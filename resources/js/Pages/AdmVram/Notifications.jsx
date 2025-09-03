import React, { useEffect, useState } from 'react'
import ContentPanel from '../../Components/Table/ContentPanel'
import { Head, router, usePage } from '@inertiajs/react';
import { useTheme } from '../../Context/ThemeContext';
import useThemeStyles from '../../Hooks/useThemeStyles';
import TopPanel from '../../Components/Table/TopPanel';
import Tooltip from '../../Components/Tooltip/Tooltip';
import Button from '../../Components/Table/Buttons/Button';
import Export from '../../Components/Table/Buttons/Export';
import CustomFilter from '../../Components/Table/Buttons/CustomFilter';
import TableSearch from '../../Components/Table/TableSearch';
import Thead from '../../Components/Table/Thead';
import TableContainer from '../../Components/Table/TableContainer';
import Row from '../../Components/Table/Row';
import TableHeader from '../../Components/Table/TableHeader';
import Tbody from '../../Components/Table/Tbody';
import RowData from '../../Components/Table/RowData';
import Pagination from '../../Components/Table/Pagination';
import RowAction from '../../Components/Table/RowAction';
import moment from 'moment';

const Notifications = ({page_title, queryParams, adm_notifications}) => {
    const { auth } = usePage().props;
    const { theme } = useTheme();
    const { primayActiveColor, textColorActive } = useThemeStyles(theme);
    const [pathname, setPathname] = useState(null);

    useEffect(() => {
        const segments = window.location.pathname.split("/");
        setPathname(segments.pop());
    }, []);

    const refreshTable = (e) => {
        e.preventDefault();
        router.get(pathname);
    };

  return (
    <>
      <Head title={page_title} />
      <ContentPanel>
        <TopPanel>
            <div className="inline-flex flex-wrap gap-1">
                <Tooltip text="Refresh data" arrow="bottom">
                    <Button
                        extendClass={
                            (["bg-skin-white"].includes(theme)
                                ? primayActiveColor
                                : theme) + " py-[5px] px-[10px]"
                        }
                        fontColor={textColorActive}
                        onClick={refreshTable}
                    >
                        <i className="fa fa-rotate-right text-base p-[1px]"></i>
                    </Button>
                </Tooltip>
                <Export path="/notifications/export" page_title={page_title}/>
            </div>
            <div className="flex">
                <CustomFilter>
                </CustomFilter>
                <TableSearch queryParams={queryParams} />
            </div>
        </TopPanel>
        <TableContainer data={adm_notifications?.data}>
          <Thead>
              <Row>
                  <TableHeader
                      sortable={false}
                      width="md"
                      justify="center"
                  >
                      Action
                  </TableHeader>
                  <TableHeader
                      name="adm_user_id"
                      queryParams={queryParams}
                      width="lg"
                  >
                      User
                  </TableHeader>
                  <TableHeader
                      name="type"
                      queryParams={queryParams}
                      width="xl"
                  >
                      Type
                  </TableHeader>
                  <TableHeader
                      name="title"
                      queryParams={queryParams}
                      width="lg"
                  >
                      Title
                  </TableHeader>
                  <TableHeader
                      name="content"
                      queryParams={queryParams}
                      width="lg"
                  >
                      Content
                  </TableHeader>
                  <TableHeader
                      name="url"
                      queryParams={queryParams}
                      width="lg"
                  >
                      URL
                  </TableHeader>
                  <TableHeader
                      name="is_read"
                      queryParams={queryParams}
                      width="lg"
                  >
                      Is Read
                  </TableHeader>
                  <TableHeader
                      name="created_at"
                      queryParams={queryParams}
                      width="lg"
                  >
                      Created At
                  </TableHeader>
                  <TableHeader
                      name="updated_at"
                      queryParams={queryParams}
                      width="lg"
                  >
                      Updated At
                  </TableHeader>
              </Row>
          </Thead>
          <Tbody data={adm_notifications?.data}>
              {adm_notifications &&
                  adm_notifications?.data.map((item, index) => (
                      <Row key={item.id}>
                          <RowData center>
                            <RowAction
                                type="button"
                                action="view"
                            />
                          </RowData>
                          <RowData >
                              {item.user?.name ?? '-'}
                          </RowData>
                          <RowData >
                              {item.type ?? '-'}
                          </RowData>
                          <RowData >
                              {item.title ?? '-'}
                          </RowData>
                          <RowData >
                              {item.content ?? '-'}
                          </RowData>
                          <RowData >
                              {item.url ?? '-'}
                          </RowData>
                          <RowData >
                              {item.is_read ?? '-'}
                          </RowData>
                          <RowData >
                              {item.created_at ? (moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")) : '-'}
                          </RowData>
                          <RowData >
                              {item.updated_at ? (moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss")) : '-'}
                          </RowData>
                      </Row>
                  ))}
          </Tbody>
        </TableContainer>
        <Pagination extendClass={theme} paginate={adm_notifications} />
      </ContentPanel>
    </>
  )
}

export default Notifications